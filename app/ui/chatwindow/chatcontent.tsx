"use client";
import { getMessages } from "@/app/lib/getmessages";
import { publicKeyType, userDataType } from "@/app/dashboard/chat/page";
import { useEffect, useRef, useState } from "react";
import { decryptMessage } from "@/app/lib/openpgp";
import { resolve } from "path";
import clsx from "clsx";
import { Timestamp } from "@firebase/firestore";
import { CheckCircleIcon as SentIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon as DeliveredIcon } from "@heroicons/react/24/solid";
import { updateMessageStatus } from "@/app/lib/firestore";
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
    date: Timestamp;
    status: string;
  };

  const [messages, setMessages] = useState<messageType[]>([]);

  const { data } = getMessages(query);

  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      console.log(data);
      if (!data) return;
      const decryptedMessages: messageType[] = await Promise.all(
        data.reverse().map(async (message) => {
          if (message.senderId == userData.mykeyID) {
            const msg = await decryptMessage(
              message.msg,
              publicKey.userkey,
              userData.name,
              userData.password,
            );
            if (msg.success) {
              return {
                owner: "me",
                content: msg.data,
                date: Timestamp.fromDate(new Date(message.timestamp)),
                status: message.staus,
              };
            } else {
              console.log(msg.error);
              return {
                owner: "me",
                content: "Error Decrypting you message",
                date: Timestamp.fromDate(new Date(message.timestamp)),
                status: message.staus,
              };
            }
          } else {
            const msg = await decryptMessage(
              message.msg,
              publicKey.friendkey,
              userData.name,
              userData.password,
            );
            updateMessageStatus(query, message.id);
            if (msg.success) {
              return {
                owner: "friend",
                content: msg.data,
                date: Timestamp.fromDate(new Date(message.timestamp)),
                status: message.staus,
              };
            } else {
              console.log(msg.error);
              return {
                owner: "friend",
                content: "Error Decrypting you message",
                date: Timestamp.fromDate(new Date(message.timestamp)),
                status: message.staus,
              };
            }
          }
        }),
      );
      setMessages(decryptedMessages);
    };
    fetchMessages();
  }, [data]);

  useEffect(() => {
    listRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className="flex-1 flex flex-col overflow-y-auto">
        {messages.map((values, index) => {
          return (
            <div
              key={index}
              className={clsx("flex flex-col mt-5 p-5", {
                " bg-slate-200 rounded-tl-3xl  rounded-r-3xl self-start":
                  values.owner == "friend",
                "bg-blue-700 text-white rounded-tr-3xl  rounded-l-3xl self-end":
                  values.owner == "me",
              })}
            >
              <div className="text-lg overflow-x-auto">{values.content}</div>
              <div className="flex flex-row self-end">
                <div className="text-sm">
                  {values.date.toDate().toLocaleTimeString()}
                </div>
                <div className="text-sm">
                  {values.status == "sent" && values.owner == "me" && (
                    <SentIcon className="size-5 ml-1" />
                  )}
                  {values.status == "delivered" && values.owner == "me" && (
                    <DeliveredIcon className="size-5 ml-1" />
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* <div className="flex flex-row mt-5 bg-blue-700 text-white rounded-tr-3xl  rounded-l-3xl self-end ">
          <div className="p-5">This is the second message</div>
        </div> */}
        <div ref={listRef}></div>
      </div>
    </>
  );
}
