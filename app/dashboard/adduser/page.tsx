"use client";
import { getFromLocalStorage } from "@/app/lib/local_storage_manager";
import { retrieveUserState } from "@/app/lib/seesion_coockie";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function AddUser() {
  const [publicKey, setPublicKey] = useState<string>("");

  const [inputKey, setInputKey] = useState<string>();

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

    setPublicKey(key ? key.key : "");
  }, []);

  const handleClick = () => {
    console.log(inputKey);
  };

  return (
    <>
      <div className="w-full h-full">
        <div className="m-10 text-3xl font-bold">Add User</div>
        <div className="flex flex-col sm:flex-row  m-10">
          <div className="self-start mr-10 lg:w-1/2 ">
            <div className="flex  -mx-3 mb-6">
              <div className="w-full p-5 bg-gray-200  rounded-lg ">
                <label className="block mb-2 text-sm font-bold text-gray-900">
                  Your Key
                </label>
                <div>{publicKey}</div>
                <ToastContainer />
                <button
                  id="login"
                  className="background-color: #007AFF; hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  mb-4 mt-5 self-end"
                  onClick={() => {
                    navigator.clipboard.writeText(publicKey);
                    toast("Public key copied to your clip board");
                  }}
                  style={{ borderRadius: "6px" }}
                >
                  Copy to Clip Board
                </button>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2  bg-gray-200  rounded-lg">
            <form
              className="flex flex-col w-full p-5 "
              onSubmit={(e) => e.preventDefault()}
            >
              <label className="block mb-2 text-sm font-bold text-gray-900">
                Your message
              </label>
              <textarea
                id="message"
                rows={15}
                className="block p-2.5 w-full h-full text-sm text-gray-900 bg-gray-200 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Leave a comment..."
                onChange={(e) => {
                  setInputKey(e.target.value);
                }}
              ></textarea>
              <p className="text-red-500 text-xs italic"></p>

              <button
                id="login"
                className="background-color: #007AFF; hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  mb-4 mt-5 self-end"
                onClick={handleClick}
                style={{ borderRadius: "6px" }}
              >
                Add
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
