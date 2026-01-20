// types.ts
export type Message = {
  id: string;
  msg: string;
  messageType: string;
  recipientId: string;
  senderId: string;
  staus: string; // keeping your spelling from prompt
  timestamp: string;
};

// The structure of our storage: A dictionary where Key = recipientId
export type MessageStorage = {
  [recipientId: string]: Message[];
};