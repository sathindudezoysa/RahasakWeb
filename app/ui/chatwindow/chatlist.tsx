"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import clsx from "clsx";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { getConversations } from "@/app/lib/firestore";
import { useState, useEffect } from "react";
import { retrieveUserState } from "@/app/lib/seesion_coockie";
import {
  getFromLocalStorage,
  saveconversations,
} from "@/app/lib/local_storage_manager";
import { getAllChats } from "@/app/dashboard/chat/lib/ManageChats";
export default function ChatList() {
  const [publicKey, setPublicKey] = useState<string>("");

  type conversation = {
    name: string;
    link: string;
  };
  const [covesations, setLinks] = useState<conversation[]>([
    {
      name: "",
      link: "",
    },
  ]);

  useEffect(() => {
    const userData = retrieveUserState("userSession");
    if (userData == null) {
      window.alert("Session expired");
      return;
    }

    // setPublicKey(userData.mykeyID);

    // const fetchdata = async () => {
    //   const list = await getConversations(userData.mykeyID);

    // console.log(list);

    const chats = getAllChats();
    const list = Object.keys(chats);

    const publicKeysString = getFromLocalStorage(
      `${userData.name}PublicKeysData`,
    );
    const jsonArray: Array<{
      name: string;
      email: string;
      date: string;
      keyID: string;
    }> = publicKeysString ? JSON.parse(publicKeysString) : [];

    if (jsonArray == null) {
      window.alert("Can not find the public keys");
      return;
    }

    const combine = (): conversation[] => {
      return list.map((obj) => {
        const name = jsonArray.find((x) => x.keyID == obj);
        return {
          name: name ? name.name : "unknown",
          link: obj,
        };
      });
    };
    setLinks(combine);

    // const combine = (): conversation[] => {
    //   return list.map((obj) => {
    //     if (obj.participantIds[0] == obj.participantIds[1]) {
    //       return {
    //         name: userData.name,
    //         link: obj.documentId,
    //       };
    //     } else if (obj.participantIds[0] == userData.mykeyID) {
    //       const name = jsonArray.find(
    //         (x) => x.keyID == obj.participantIds[1]
    //       );
    //       return {
    //         name: name ? name.name : "unknown",
    //         link: obj.documentId,
    //       };
    //     } else {
    //       const name = jsonArray.find(
    //         (x) => x.keyID == obj.participantIds[0]
    //       );
    //       saveconversations(
    //         userData.name,
    //         obj.participantIds[0],
    //         obj.documentId
    //       );
    //       return {
    //         name: name ? name.name : "unknown",
    //         link: obj.documentId,
    //       };
    //     }
    //   });
    // };
    // setLinks(combine);
  }, []);

  const pathname = usePathname();
  const searhPrams = useSearchParams();
  const { replace } = useRouter();

  function handleChat(term: string) {
    const params = new URLSearchParams(searhPrams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <>
      <div className="flex flex-col max-w-[317px] w-full ">
        <div className="flex flex-row w-full  h-[93px] border-b-2  border-slate-200">
          <div className="flex-1 self-center font-semibold text-lg">
            Messages
          </div>
          <Link
            key={"adduser"}
            href={"/dashboard/newchat"}
            className="self-center"
          >
            <PlusCircleIcon className="size-10" />
          </Link>
        </div>
        <div className="grid">
          {covesations.map((link) => {
            return (
              <div
                key={link.link}
                onClick={() => handleChat(link.link)}
                className={clsx(
                  "flex mt-2 h-[93px] w-full items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-slate-100 md:flex-none md:justify-start md:p-2 md:px-3",
                  {
                    "bg-slate-100": searhPrams.get("query") === link.link,
                  },
                )}
              >
                <p>{link.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
