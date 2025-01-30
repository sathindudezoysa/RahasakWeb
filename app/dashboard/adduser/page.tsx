"use client";
import {
  getFromLocalStorage,
  savePublicKeys,
} from "@/app/lib/local_storage_manager";
import { getKeyData } from "@/app/lib/openpgp";
import { retrieveUserState } from "@/app/lib/seesion_coockie";
import PopUp from "@/app/ui/popup";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function AddUser() {
  const [userName, setUserName] = useState<string>("");
  const [inputName, setInputName] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string>("");
  const [inputKey, setInputKey] = useState<string>();
  const [confirmationModal, setConfirmationModal] = useState<Boolean>();

  type keyDataType = {
    name: string;
    email: string;
    keyid: string;
  };
  const [keyData, setKeyData] = useState<keyDataType>();

  useEffect(() => {
    const userData = retrieveUserState("userSession");
    if (userData == null) {
      window.alert("Session expired");
      return;
    }
    setUserName(userData.name);

    const publicKeys = getFromLocalStorage(`${userData.name}PublicKeys`);
    const keyArray: Array<{
      keyID: string;
      key: string;
    }> = publicKeys ? JSON.parse(publicKeys) : [];

    const key = keyArray.find((obj) => obj.keyID == userData.mykeyID);

    setPublicKey(key ? key.key : "");
  }, []);

  const handleClick = async () => {
    console.log("click");
    const data = await getKeyData(inputKey ? inputKey : "");
    if (data.success) {
      setKeyData(data.data);
      setConfirmationModal(true);
    } else {
      window.alert(data.error);
    }
  };

  const savekeys = async () => {
    if (keyData == null) {
      window.alert("Key data didn't set");
      return;
    }

    let name = keyData.name;
    if (inputName != null) {
      name = inputName;
    }

    const currentDate = await new Date();
    const formattedDate = currentDate.toLocaleDateString();
    await savePublicKeys(
      userName,
      name,
      keyData?.email,
      formattedDate,
      inputKey ? inputKey : ""
    );
    redirect("/dashboard");
  };
  return (
    <>
      {confirmationModal && (
        <PopUp
          trigger={true}
          childern={
            <div className="w-full flex flex-col p-3">
              <div className="text-xl font-bold">
                <p>Confirm Key to Import</p>
              </div>
              <hr className="w-full mt-3 mb-5" />
              <div className="w-full">
                <table className="w-full text-sm text-left rtl:text-right">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100 ">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Key ID
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {keyData?.name}
                      </td>
                      <td>{keyData?.email}</td>
                      <td>{keyData?.keyid}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="pt-3 text-gray-500">
                  <p className="font-thin">"Optional"</p>
                  <p>Add a cutom name to save this key</p>
                </div>
                <div className="mt-3">
                  <form
                    className="flex flex-row"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <input
                      className="flex-1 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      type="text"
                      onChange={(e) => setInputName(e.target.value)}
                    ></input>
                    <button
                      className="ml-3 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
                      style={{ backgroundColor: "#007AFF" }}
                      onClick={savekeys}
                    >
                      save
                    </button>
                  </form>
                </div>
              </div>
            </div>
          }
        />
      )}

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
