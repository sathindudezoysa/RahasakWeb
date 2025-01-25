"use client";
import {
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  ArrowLeftStartOnRectangleIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {} from "@heroicons/react/24/solid";

const links = [
  {
    name: "Home",
    href: "/dashboard",
    icon: HomeIcon,
  },
  { name: "chat", href: "/dashboard/chat", icon: ChatBubbleLeftRightIcon },
  { name: "adduser", href: "/dashboard/adduser", icon: PlusCircleIcon },
  { name: "search", href: "", icon: MagnifyingGlassIcon },
  { name: "settings", href: "", icon: Cog6ToothIcon },
  {
    name: "logout",
    href: "/logout",
    icon: ArrowLeftStartOnRectangleIcon,
  },
];
export default function SideNav() {
  const pathname = usePathname();
  return (
    <>
      <div className="flex flex-col p-4 w-auto items-start">
        <div className="flex size-[56px] bg-black rounded-xl justify-evenly  items-center">
          <div className="self-center ">
            <Image src={"/logo-white.png"} width={35} height={35} alt="logo" />
          </div>
        </div>
        <div className="grid">
          {links.map((link) => {
            const LinkIcon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={clsx(
                  "flex mt-6 h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
                  {
                    "bg-sky-100 text-blue-600": pathname === link.href,
                  }
                )}
              >
                <LinkIcon className="w-6" />
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
