import { Message } from "@/app/types/type";

export function getAllChats(): Record<string, Message[]> {
  const allChats: Record<string, Message[]> = {};

  // 1. Loop through all keys in localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    // 2. Check if the key starts with the specific prefix
    if (key && key.startsWith("chat-")) {
      try {
        const rawData = localStorage.getItem(key);

        if (rawData) {
          // 3. Extract the recipientId (remove "chat-" prefix)
          const recipientId = key.replace("chat-", "");

          // 4. Parse the messages and add to result object
          const messages: Message[] = JSON.parse(rawData);
          allChats[recipientId] = messages;
        }
      } catch (error) {
        console.error(`Failed to load chat for key ${key}:`, error);
      }
    }
  }

  return allChats;
}
