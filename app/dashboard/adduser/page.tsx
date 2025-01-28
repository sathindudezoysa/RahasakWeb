"use client";
import { getFromLocalStorage } from "@/app/lib/local_storage_manager";
import { retrieveUserState } from "@/app/lib/seesion_coockie";
import { useEffect, useState } from "react";

export default function AddUser() {
  const [publicKey, setPublicKey] = useState<string>();

  useEffect(() => {
    const userData = retrieveUserState("userSession");
    if (userData == null) {
      window.alert("Session expired");
      return;
    }

    const publicKeys = getFromLocalStorage(`${userData.name}PublicKeys`);
    const keyArray: Array<{
      keyID: string;
      key: string;
    }> = publicKeys ? JSON.parse(publicKeys) : [];

    const key = keyArray.find((obj) => obj.keyID == userData.mykeyID);

    setPublicKey(key?.key);
  }, []);

  return (
    <>
      <div className="w-full h-full">
        <div className="m-10 text-3xl font-bold">Add User</div>
        <div className="flex flex-col sm:flex-row w-full m-10">
          <div className="self-start mr-10 max-w-[400px] ">
            <div className="flex  -mx-3 mb-6">
              <div className="w-full px-3">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Your Key
                </label>
                <div className=" bg-gray-200 rounded-lg ">{publicKey}</div>
              </div>
            </div>
          </div>
          <div className="">
            <div className="w-full">
              {/* <p className="mb-6 text-start" style={{ fontWeight: "bold" }}>
                Add a Friend
              </p> */}
            </div>
            <form className="flex flex-col w-full max-w-lg mx-auto">
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Your message
                  </label>
                  <textarea
                    id="message"
                    rows={10}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-200 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Leave a comment..."
                  ></textarea>
                  <p className="text-red-500 text-xs italic"></p>
                </div>
              </div>

              <button
                id="login"
                className="background-color: #007AFF; hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  mb-4 self-end"
                // onClick={handleClick}
                style={{ borderRadius: "6px" }}
              >
                Add
              </button>
            </form>
            <hr className="w-96 h-px my-8 bg-gray-200 border-0 dark:bg-gray-300" />
          </div>
        </div>
      </div>
    </>
  );
}
