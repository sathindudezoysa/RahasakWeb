"use client";
import { getFromLocalStorage } from "@/app/lib/local_storage_manager";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { retrieveUserState } from "@/app/lib/seesion_coockie";
import { encryptForGroup, encryptMessage } from "@/app/lib/openpgp";
import { writeMessages } from "@/app/lib/firestore";
import {
  conversationsType,
  publicKeyType,
  userDataType,
} from "@/app/dashboard/chat/page";

export default function ChatBox({
  query,
  userData,
  publicKey,
}: {
  query: string;
  userData: userDataType;
  publicKey: publicKeyType;
}) {
  const [plainMessage, setMessages] = useState("");

  //   /*
  //     Form Submission
  //     */
  // }
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessages("");

    if (publicKey.friendkey == "") {
      window.alert("key not setted");
      return;
    }

    const message = await encryptForGroup(
      plainMessage,
      [publicKey.friendkey, publicKey.userkey],
      userData.name,
      userData.password
    );
    if (message.success) {
      const send = await writeMessages({
        documentId: query,
        msg: message.data,
        messageType: "text",
        recipientId: publicKey.friendkeyID,
        senderId: userData.mykeyID,
        staus: "sent",
        timestamp: "",
      });
      setMessages("");
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
            value={plainMessage}
            onChange={(e) => setMessages(e.target.value)}
          />
          <button className=" ml-2 inline-flex size-10 items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-[#111827E6] ">
            <PaperAirplaneIcon className="size-6 " />
          </button>
        </form>
      </div>
    </>
  );
}
