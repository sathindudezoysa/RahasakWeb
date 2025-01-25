"use client";
import { retrieveUserState } from "./lib/seesion_coockie";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { redirect } from "next/navigation";

export default function Home() {
  useEffect(() => {
    const auth = retrieveUserState("userSession");

    if (auth == null) {
      redirect("/login");
    } else {
      console.log(auth);
    }
  });

  return;
}
