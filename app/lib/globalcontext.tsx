"use client ";
import React, { createContext, useState } from "react";

type DataItem = {
  name: string;
  email: string;
  date: string;
  keyID: string;
};

type contextType = {
  userData: DataItem[];
  setUserData: React.Dispatch<React.SetStateAction<DataItem[]>>;
};

export const GlobalContext = createContext<contextType>({
  userData: [
    {
      name: "sat",
      email: "sad",
      date: "asd",
      keyID: "dad",
    },
  ],
  setUserData: () => {},
});
