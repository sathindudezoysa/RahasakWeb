

/**
 * This for Kfka Connection
 */

import { strict } from "assert";
import { createConversation } from "../lib/firestore";
import { getMessages } from "../lib/getmessages";
import { Message } from "../types/type";
import API from "./api";
import { getAllChats } from "../dashboard/chat/lib/ManageChats";


const controller = new AbortController();

type MessageStatus<T> = { success: true;} | {success: false; error: string};


export const messageService ={

    sendMessage : async (message: Message): Promise<MessageStatus<null>> =>{
        const msg = JSON.stringify(message)
        const payload = {
            topic: message.recipientId,
            message: msg
        }
        
        try{
            const response  = await API.post('/send', payload);
            return {success: true}
        }catch{
            return {success: false, error: "error occured when sending message"};
        }
    },   
    createConversation : (friendkey: string) =>{
        const chats = getAllChats();
        const recipients = Object.keys(chats);
        console.log(friendkey);
        console.log(chats);
        const is = recipients.find(val => val == friendkey);

        if(is == null){

        const storageKey = `chat-${friendkey}`;

        const existingHistory = "[]";

        localStorage.setItem(storageKey, JSON.stringify(existingHistory));

        }
    }
}