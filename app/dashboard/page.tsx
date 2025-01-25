"use client";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { retrieveUserState } from "../lib/seesion_coockie";

export default function Dashboard() {
  // useEffect(() => {
  //   const auth = retrieveUserState("userSession");

  //   if (auth == null) {
  //     redirect("/login");
  //   } else {
  //     console.log(auth);
  //   }
  // });

  return (
    <>
      <div></div>
    </>
  );
}
