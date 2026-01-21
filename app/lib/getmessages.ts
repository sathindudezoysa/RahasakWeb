"use client"

import { collection, query, orderBy, limit, getFirestore, onSnapshot, where, Timestamp } from "@firebase/firestore"
import app from "./firebaseConfig";


const db = getFirestore(app)

import { useEffect, useState } from "react"
import { KafkaListner } from "../services/KafkaListener";
import { Message } from "../types/type";
import { getAllChats } from "../dashboard/chat/lib/ManageChats";

export function getMessages(conversationKey: string){

    const [data, setData] = useState<Message[]>()

    useEffect(() => {
        const chatsRecord = getAllChats();
        const chats = chatsRecord[conversationKey] || [];
        console.log(chats);
        setData(chats)
      }, [conversationKey]);
    
    // useEffect(()=>{
    //     const getquery = query(
    //         collection(db, "conversations", conversationKey, "messages"),
    //         orderBy("timestamp", "desc"),
    //         limit(20)
    //     )
        
    //     const unsubscribe = onSnapshot(getquery, (snapshot) => {
    //         const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    //         setData(docs);
    //       });

    //       return () => unsubscribe();
    // }, [db, conversationKey])
    return {data}
}