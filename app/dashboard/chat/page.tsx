"use client";
import ChatBox from "@/app/ui/chatwindow/chatbox";
import ChatContent from "@/app/ui/chatwindow/chatcontent";
import ChatHeader from "@/app/ui/chatwindow/chatheader";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { retrieveUserState } from "@/app/lib/seesion_coockie";
import { getFromLocalStorage } from "@/app/lib/local_storage_manager";

export interface conversationsType {
  name: string;
  conversationId: string;
}
export interface publicKeyType {
  userkey: string;
  friendkeyID: string;
  friendkey: string;
}
export interface userDataType {
  name: string;
  email: string;
  password: string;
  mykeyID: string;
}

export default function Chat() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const [count, setCount] = useState(0);
  const [conversations, setConversations] = useState<conversationsType[]>([]);
  const [publicKey, setPublicKey] = useState<publicKeyType>({
    userkey: "",
    friendkeyID: "",
    friendkey: "",
  });
  const [userData, setUserData] = useState<userDataType>({
    name: "",
    email: "",
    password: "",
    mykeyID: "",
  });

  useEffect(() => {
    //Getting use state
    const y = retrieveUserState("userSession");
    if (y == null) {
      window.alert("Session expired");
      return;
    }
    setUserData(y);

    //Getting the conversations
    const conversationsString = getFromLocalStorage(`${y.name}Conversations`);
    if (conversationsString == null) {
      window.alert("Conversations file not found");
      return;
    }

    setConversations(JSON.parse(conversationsString));
    setCount(count + 1);
  }, []);

  // Find the recipient id from the convesation
  useEffect(() => {
    if (query != "" && count > 0) {
      const recipientId = conversations.find((u) => u.conversationId == query);
      if (recipientId == null) {
        return;
      }

      //Getting the public key for the recipent
      const publicKeyStrings = getFromLocalStorage(
        `${userData.name}PublicKeys`
      );

      if (publicKeyStrings == null) {
        window.alert("Public Key file not found");
        return;
      }
      const publicKeys = JSON.parse(publicKeyStrings);
      //Find the recipient id from the convesation
      const fkey = publicKeys.find(
        (u: { keyID: string; key: string }) => u.keyID == recipientId.name
      );
      const ukey = publicKeys.find(
        (u: { keyID: string; key: string }) => u.keyID == userData.mykeyID
      );
      if (fkey == null || ukey == null) {
        window.alert("key not found");
      } else {
        setPublicKey({
          userkey: ukey.key,
          friendkeyID: recipientId.name,
          friendkey: fkey.key,
        });
      }
    }
  }, [query, count]);

  return (
    <>
      <div className="flex-1 bg-slate-100  ml-4 flex flex-col w-full min-w-[400px]">
        <ChatHeader />
        <div className="ml-10 mr-10 flex flex-col h-full">
          {query !== "" && (
            <ChatContent
              query={query}
              userData={userData}
              publicKey={publicKey}
            />
          )}
          {query !== "" && (
            <ChatBox query={query} userData={userData} publicKey={publicKey} />
          )}
        </div>
      </div>
    </>
  );
}
