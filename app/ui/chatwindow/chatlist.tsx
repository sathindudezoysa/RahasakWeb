"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { getConversations } from "@/app/lib/firestore";
import { useState, useEffect } from "react";
import { retrieveUserState } from "@/app/lib/seesion_coockie";

const links = [
  {
    name: "Sathindu Dhansuhka",
    href: "/dashboard",
  },
  { name: "Rahasak", href: "/dashboard/chat" },
  { name: "search", href: "" },
  { name: "settings", href: "" },
];

export default function ChatList() {
  const [publicKey, setPublicKey] = useState<string>("");

  useEffect(() => {
    const userData = retrieveUserState("userSession");
    if (userData == null) {
      window.alert("Session expired");
      return;
    }

    setPublicKey(userData.mykeyID);
  }, []);

  const pathname = usePathname();

  // const list = getConversations(publicKey);
  // console.log(list);

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
          {links.map((link) => {
            return (
              <Link
                key={link.name}
                href={link.href}
                className={clsx(
                  "flex mt-2 h-[93px] w-full items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-slate-100 md:flex-none md:justify-start md:p-2 md:px-3",
                  {
                    "bg-slate-100": pathname === link.href,
                  }
                )}
              >
                <p>{link.name}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
