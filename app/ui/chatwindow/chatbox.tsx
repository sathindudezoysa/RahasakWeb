"use client";
import { getFromLocalStorage } from "@/app/lib/local_storage_manager";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { retrieveUserState } from "@/app/lib/seesion_coockie";
import { encryptMessage } from "@/app/lib/openpgp";
import { writeMessages } from "@/app/lib/firestore";

export default function ChatBox({ query }: { query: string }) {
  type conversationsType = {
    name: string;
    conversationId: string;
  };
  type publicKeyType = {
    key: string;
    keyID: string;
  };
  type userDataType = {
    name: string;
    email: string;
    password: string;
    mykeyID: string;
  };
  const [value, setValue] = useState("");
  const [conversations, setConversations] = useState<conversationsType[]>([]);
  const [publicKey, setPublicKey] = useState<publicKeyType>({
    key: "",
    keyID: "",
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
  }, []);

  // Find the recipient id from the convesation
  useEffect(() => {
    console.log(query);
    if (query != "") {
      const recipientId = conversations.find((u) => u.conversationId == query);

      //Getting the public key for the recipent
      const publicKeyStrings = getFromLocalStorage(
        `${userData.name}PublicKeys`
      );

      if (publicKeyStrings == null) {
        window.alert("Public Key file not found");
        return;
      }
      const publicKeys: publicKeyType[] = JSON.parse(publicKeyStrings);
      //Find the recipient id from the convesation
      const key = publicKeys.find((u) => u.keyID == recipientId?.name);
      if (key == null) {
        window.alert("key not found");
      } else {
        setPublicKey(key);
      }
    }
  }, [query]);

  //   /*
  //     Form Submission
  //     */
  // }
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (publicKey.key == "") {
      window.alert("key not setted");
      return;
    }

    const message = await encryptMessage(
      value,
      publicKey.key,
      userData.name,
      userData.password
    );
    if (message.success) {
      const currentDate = await new Date();
      const formattedDate = currentDate.toLocaleDateString();
      const send = await writeMessages({
        documentId: query,
        msg: message.data,
        messageType: "text",
        recipientId: publicKey.keyID,
        senderId: userData.mykeyID,
        staus: "sent",
        timestamp: formattedDate,
      });
      if (!send.success) {
        window.alert(send.error);
      }
    } else {
      window.alert(message.error);
    }
  };

  return (
    <>
      <div className="flex items-center pt-2 pb-2 h-15">
        <form
          onSubmit={handleSubmit}
          className="flex items-center justify-center w-full"
        >
          <input
            className="flex w-full h-10 rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
            placeholder="Type your message"
            onChange={(e) => setValue(e.target.value)}
          />
          <button className=" ml-2 inline-flex size-10 items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-[#111827E6] ">
            <PaperAirplaneIcon className="size-6 " />
          </button>
        </form>
      </div>
    </>
  );
}
