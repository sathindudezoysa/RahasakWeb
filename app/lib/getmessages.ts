"use client"

import { collection, query, orderBy, limit, getFirestore, onSnapshot, where, Timestamp } from "@firebase/firestore"
import app from "./firebaseConfig";


const db = getFirestore(app)

import { useEffect, useState } from "react"

export function getMessages(conversationKey: string){

    const [data, setData] = useState<any[]>([])
    
    useEffect(()=>{
        const getquery = query(
            collection(db, "conversations", conversationKey, "messages"),
            orderBy("timestamp", "desc"),
            limit(20)
        )
        
        const unsubscribe = onSnapshot(getquery, (snapshot) => {
            const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setData(docs);
          });

          return () => unsubscribe();
    }, [db, conversationKey])
    return {data}
}