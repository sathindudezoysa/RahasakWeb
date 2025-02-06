import { doc, Firestore, getDoc, getDocs, getFirestore, limit, orderBy, query, updateDoc, where } from "@firebase/firestore";
import { addDoc, collection } from "@firebase/firestore";

import app from "./firebaseConfig";
import { getFromLocalStorage, saveconversations } from "./local_storage_manager";
import { Timestamp } from "@firebase/firestore";

const db = getFirestore(app)
export default db;

export async function createConversation(username: string, userkey: string, friendkey: string): Promise<string | null>{

    const conversations = getFromLocalStorage(`${username}Conversations`)
    const filevalues: Array<{name: string, conversationId: string}> = conversations ? JSON.parse(conversations) : [];

    const is = filevalues.find(val => val.name === friendkey);


if (is == null){
    try{
        const docRef = await addDoc(collection(db, "conversations"),{
            participantIds: [userkey, friendkey],
            
        });

        await updateDoc(doc(db, 'conversations', docRef.id),{
            documentId: docRef.id,
        })

        saveconversations(username, friendkey, docRef.id)
        return docRef.id
    }catch(e){
        console.log(e)
        return null
    }
}else{

    return is.conversationId;
}
}

type convesation = {
    documentId: string;
    participantIds: string[];
  };
export async function getConversations(userkey:string): Promise<convesation[]> {
    

    const getquery = query(
        collection(db, "conversations"),
        where("participantIds", "array-contains", userkey)
    ) 

    let conv:string[] = []
    const querySnapshot = await getDocs(getquery);
    const allDoc = querySnapshot.forEach((snap) => conv.push(JSON.stringify(snap.data())))

    
    const jsonArray = conv.map(str => JSON.parse(str) as convesation);
    return jsonArray
    
}



type message ={
    documentId: string;
    msg: string;
    messageType: string;
    recipientId: string;
    senderId: string;
    staus: string;
    timestamp: string;
}

type MessageStatus<T> = { success: true;} | {success: false; error: string};

export async function writeMessages(content: message): Promise<MessageStatus<null>> {
    try{
        const docRef = await addDoc(collection(db, "conversations", content.documentId, "messages"),{
            msg: content.msg,
            messageType: content.messageType,
            recipientId: content.recipientId,
            senderId: content.senderId,
            staus: content.staus,
            timestamp: Timestamp.now(),
        } );
        return {success: true}
    }catch (e){
        console.log(e)
        return {success: false, error: "error occured when sending message"}
    }
    
}

export async function updateMessageStatus(documentId: string, messageId: string){
    const docRef =  doc(db, "conversations", documentId, "messages", messageId);
    try{
        await updateDoc(docRef, {
            staus: "delivered"
        })
    }catch(e){
        console.log(e)
    }
}