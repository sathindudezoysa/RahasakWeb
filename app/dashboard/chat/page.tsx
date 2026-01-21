"use client";
import ChatBox from "@/app/ui/chatwindow/chatbox";
import ChatContent from "@/app/ui/chatwindow/chatcontent";
import ChatHeader from "@/app/ui/chatwindow/chatheader";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { retrieveUserState } from "@/app/lib/seesion_coockie";
import { getFromLocalStorage } from "@/app/lib/local_storage_manager";
import { getAllChats } from "./lib/ManageChats";
import { KafkaListner } from "@/app/services/KafkaListener";

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
  const [conversations, setConversations] = useState<string[]>([]);
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
  const [publicKeyFile, setPublicKeyFile] = useState<string>("");
  const [publicNameFile, setPublicNameFile] = useState<string>("");

  const [chatName, setChatName] = useState("");

  useEffect(() => {
    //Getting use state
    const y = retrieveUserState("userSession");
    if (y == null) {
      window.alert("Session expired");
      return;
    }
    setUserData(y);

    //Getting the conversations
    // const conversationsString = getFromLocalStorage(`${y.name}Conversations`);
    // if (conversationsString == null) {
    //   window.alert("Conversations file not found");
    //   return;
    // }

    const stream = KafkaListner(y.mykeyID, (msg) => {
      console.log("New message:", msg);
    });

    const chats = getAllChats();
    const recipients = Object.keys(chats);
    setConversations(recipients);

    //Getting the public key for the recipent
    const publicKeyStrings = getFromLocalStorage(`${y.name}PublicKeys`);

    if (publicKeyStrings == null) {
      window.alert("Public Key file not found");
      return;
    }
    setPublicKeyFile(publicKeyStrings);

    const publicNameString = getFromLocalStorage(`${y.name}PublicKeysData`);
    if (publicNameString == null) {
      window.alert("Public Key Names file not found");
      return;
    }
    setPublicNameFile(publicNameString);
    setCount(count + 1);

    return () => {
      stream.close();
    };
  }, []);

  // Find the recipient id from the convesation
  useEffect(() => {
    if (query != "" && count > 0) {
      const recipientId = conversations.find((u) => u == query);
      if (recipientId == null) {
        return;
      }

      const publicKeys = JSON.parse(publicKeyFile);

      //Find the friends public key
      const fkey = publicKeys.find(
        (u: { keyID: string; key: string }) => u.keyID == recipientId,
      );

      //Find my public key
      const ukey = publicKeys.find(
        (u: { keyID: string; key: string }) => u.keyID == userData.mykeyID,
      );

      if (fkey == null || ukey == null) {
        window.alert("key not found");
      } else {
        setPublicKey({
          userkey: ukey.key,
          friendkeyID: recipientId,
          friendkey: fkey.key,
        });
      }
      const friendnames = JSON.parse(publicNameFile);
      console.log(friendnames);
      const friendName = friendnames.find(
        (u: { name: string; email: string; date: string; keyID: string }) =>
          u.keyID == recipientId,
      );
      setChatName(friendName.name);
    }
  }, [query, count]);

  return (
    <>
      <div className="flex-1 bg-slate-100  ml-4 flex flex-col w-full h-full min-w-[400px]">
        <ChatHeader name={chatName} />
        <div className="ml-10 mr-10 h-full overflow-hidden flex flex-col ">
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
