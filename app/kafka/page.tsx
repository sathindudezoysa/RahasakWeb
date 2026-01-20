"use client";

import { useEffect, useState } from "react";
import { messageService } from "../services/MessageService";
import { Message } from "../types/type";
import { KafkaListner } from "../services/KafkaListener";

export default function Kafka() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stream = KafkaListner("df024a9ba22b5fac", (msg) => {
      console.log("New message:", msg);
    });

    return () => {
      stream.close();
    };
  }, []);

  function send() {
    console.log("hello");
    const val: Message = {
      id: "dadw",
      msg: message,
      messageType: "text",
      recipientId: "3112",
      senderId: "wasdfsad",
      staus: "seen",
      timestamp: Date.now().toString(),
    };

    messageService.sendMessage(val);
  }

  return (
    <>
      <h1>Hello world</h1>

      <div className="w-full">
        <input onChange={(e) => setMessage(e.target.value)} type="text" />

        <button onClick={send}>send</button>
      </div>
    </>
  );
}
