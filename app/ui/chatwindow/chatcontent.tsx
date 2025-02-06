"use client";
import { getMessages } from "@/app/lib/getmessages";
import { publicKeyType, userDataType } from "@/app/dashboard/chat/page";
import { useEffect, useState } from "react";
import { decryptMessage } from "@/app/lib/openpgp";
import { resolve } from "path";
import clsx from "clsx";

export default function ChatContent({
  query,
  userData,
  publicKey,
}: {
  query: string;
  userData: userDataType;
  publicKey: publicKeyType;
}) {
  type messageType = {
    owner: "me" | "friend";
    content: string;
    date: string;
    status: string;
  };

  const [messages, setMessages] = useState<messageType[]>([]);

  const { data } = getMessages(query);

  useEffect(() => {
    const fetchMessages = async () => {
      const decryptedMessages: messageType[] = await Promise.all(
        data.map(async (message) => {
          if (message.senderId == userData.mykeyID) {
            const msg = await decryptMessage(
              message.msg,
              publicKey.userkey,
              userData.name,
              userData.password
            );
            if (msg.success) {
              return {
                owner: "me",
                content: msg.data,
                date: message.timestamp,
                status: message.staus,
              };
            } else {
              console.log(msg.error);
              return {
                owner: "me",
                content: "Error Decrypting you message",
                date: message.timestamp,
                status: message.staus,
              };
            }
          } else {
            const msg = await decryptMessage(
              message.msg,
              publicKey.friendkey,
              userData.name,
              userData.password
            );
            if (msg.success) {
              return {
                owner: "friend",
                content: msg.data,
                date: message.timestamp,
                status: message.staus,
              };
            } else {
              console.log(msg.error);
              return {
                owner: "friend",
                content: "Error Decrypting you message",
                date: message.timestamp,
                status: message.staus,
              };
            }
          }
        })
      );
      setMessages(decryptedMessages);
    };
    fetchMessages();
  }, [data]);

  return (
    <>
      <div className="flex-1 h-full flex flex-col">
        {messages.map((values, index) => {
          return (
            <div
              key={index}
              className={clsx("flex flex-row mt-5", {
                " bg-slate-200 rounded-tl-3xl  rounded-r-3xl self-start":
                  values.owner == "friend",
                "bg-blue-700 text-white rounded-tr-3xl  rounded-l-3xl self-end":
                  values.owner == "me",
              })}
            >
              <div className="p-5">{values.content}</div>
            </div>
          );
        })}

        {/* <div className="flex flex-row mt-5 bg-blue-700 text-white rounded-tr-3xl  rounded-l-3xl self-end ">
          <div className="p-5">This is the second message</div>
        </div> */}
      </div>
    </>
  );
}
