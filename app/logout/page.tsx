"use client";

import { deleteUserState } from "@/app/lib/seesion_coockie";
import { redirect } from "next/navigation";

export default function () {
  deleteUserState("userSession");
  redirect("/login");
}
