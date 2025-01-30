import { doc, Firestore, getDoc, getDocs, getFirestore, orderBy, query, updateDoc, where } from "@firebase/firestore";
import { addDoc, collection } from "@firebase/firestore";

import app from "./firebaseConfig";
import { getFromLocalStorage, saveconversations } from "./local_storage_manager";

const db = getFirestore(app)
export default db;

export async function createConversation(username: string, userkey: string, friendkey: string){

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
    }
}else{

    console.log(is.conversationId)

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