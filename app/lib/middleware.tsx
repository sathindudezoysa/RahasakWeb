"use client";
import { useEffect } from "react";
import { retrieveUserState } from "./seesion_coockie";
import { redirect } from "next/navigation";
import { usePathname } from "next/navigation";

export default function MiddleWare() {
  const pathname = usePathname();
  useEffect(() => {
    const auth = retrieveUserState("userSession");
    if (auth == null) {
      if (
        !(
          pathname == "/login" ||
          pathname == "/login/register" ||
          pathname == "/"
        )
      ) {
        redirect("/login");
      }
    }
    if (
      (pathname == "/login" || pathname == "/login/register") &&
      auth != null
    ) {
      redirect("/dashboard");
    }
  });
  return <></>;
}
