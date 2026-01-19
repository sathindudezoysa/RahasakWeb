

/**
 * This for Kfka Connection
 */

import { getMessages } from "../lib/getmessages";
import API from "./api";

type Message ={
    documentId: string;
    msg: string;
    messageType: string;
    recipientId: string;
    senderId: string;
    staus: string;
    timestamp: string;
}

const controller = new AbortController();


export const messageService ={

    sendMessage : async (message: Message) =>{
        const msg = JSON.stringify(message)
        const payload = {
            topic: message.recipientId,
            message: msg
        }
        const response  = await API.post('/send', payload);
        return response;
    },


    startStream: async (userId: string) => {
      try {
        const response = await API.get(`/stream`, {
          params: { topic: userId },
          responseType: 'stream', // <--- IMPORTANT: Tell Axios not to buffer
          adapter: 'fetch',       // <--- IMPORTANT: Use Fetch adapter (standard in Next.js)
          signal: controller.signal,
        });

        const reader = response.data.getReader();
        const decoder = new TextDecoder();

        while (isConnected.current) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          parseSSEChunk(chunk);
        }
      } catch (err) {
        if (API.isCancel(err)) {
          console.log('Stream disconnected');
        } else {
          console.error('Stream error:', err);
        }
      }
    }
    
}
const parseSSEChunk = (chunk: string) => {
      const lines = chunk.split('\n\n');
      lines.forEach((line) => {
        if (line.startsWith('data:')) {
          const cleanMessage = line.replace('data:', '').trim();
          if (cleanMessage) {
            setMessages((prev) => [...prev, cleanMessage]);
          }
        }
      });
    };