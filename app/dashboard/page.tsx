"use client";
import {
  ChatBubbleOvalLeftEllipsisIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import { getFromLocalStorage } from "../lib/local_storage_manager";
import { retrieveUserState } from "../lib/seesion_coockie";
import { getKeyIdFromPublicKey } from "../lib/openpgp";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createConversation } from "../lib/firestore";

export default function Dashboard() {
  interface DataItem {
    name: string;
    email: string;
    date: string;
    keyID: string;
  }
  const [jsonArray, setUserData] = useState<DataItem[]>([]);

  type user = {
    name: string;
    keyId: string;
  };
  const [mydata, setmyData] = useState<user>({
    name: "",
    keyId: "",
  });

  useEffect(() => {
    const userData = retrieveUserState("userSession");
    if (userData == null) {
      window.alert("Session expired");
      return;
    }

    setmyData({
      name: userData.name,
      keyId: userData.mykeyID,
    });

    const publicKeysString = getFromLocalStorage(
      `${userData.name}PublicKeysData`
    );
    const jsonArray: Array<{
      name: string;
      email: string;
      date: string;
      keyID: string;
    }> = publicKeysString ? JSON.parse(publicKeysString) : [];

    if (jsonArray.length == 0) {
      window.alert("Your Public Keys were missing");
    } else {
      setUserData(jsonArray);
    }
  }, []);

  return (
    <>
      <div className="w-full">
        <div className="m-10 text-3xl font-bold">Dashboard</div>
        <div className="relative overflow-x-auto sm:rounded-lg m-10">
          <table className="w-full text-sm text-left rtl:text-right">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
              <tr>
                <th scope="col" className="px-6 py-3"></th>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Key ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Created
                </th>
                <th scope="col" className="px-6 py-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {jsonArray.map((item, index) => {
                return (
                  <tr
                    key={index}
                    className="bg-white border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td>
                      <KeyIcon className="size-6" />
                    </td>
                    <td
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {item.name}
                    </td>
                    <td className="px-6 py-4">{item.email}</td>
                    <td className="px-6 py-4">{item.keyID}</td>
                    <td className="px-6 py-4">{item.date}</td>
                    <td className="px-6 py-4 text-right">
                      {/* <a
                        href="#"
                        className="font-medium text-blue-600 hover:underline"
                      >
                        Edit
                      </a> */}
                      {/* <Link href={`/dashboard/chat/${item.name}`}>
                        <ChatBubbleOvalLeftEllipsisIcon className="size-6" />
                      </Link> */}
                      <button
                        onClick={() => {
                          createConversation(
                            mydata.name,
                            mydata.keyId,
                            item.keyID
                          );
                        }}
                      >
                        <ChatBubbleOvalLeftEllipsisIcon className="size-6" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* <tr className="bg-white border-b border-gray-200 hover:bg-gray-50">
                <td></td>
                <td
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  Microsoft Surface Pro
                </td>
                <td className="px-6 py-4">White</td>
                <td className="px-6 py-4">Laptop PC</td>
                <td className="px-6 py-4">$1999</td>
                <td className="px-6 py-4 text-right">
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Edit
                  </a>
                </td>
              </tr>
              <tr className="bg-white hover:bg-gray-50">
                <td></td>
                <td
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  Magic Mouse 2
                </td>
                <td className="px-6 py-4">Black</td>
                <td className="px-6 py-4">Accessories</td>
                <td className="px-6 py-4">$99</td>
                <td className="px-6 py-4 text-right">
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Edit
                  </a>
                </td>
              </tr> */}
          </table>
        </div>
      </div>
    </>
  );
}
