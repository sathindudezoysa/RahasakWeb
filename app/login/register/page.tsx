"use client";

import { useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import { getHashValue, isMatch } from "@/app/lib/hash";
import { saveToLocalStorage } from "@/app/lib/local_storage_manager";
import { keygen } from "@/app/lib/openpgp";

export default function KeyGenForm() {
  const [formData, setFormData] = useState({
    username: "sathindu",
    email: "sathindu.d.zoysa@gmail.com",
    password: "123456",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors: {
      username: string;
      email: string;
      password: string;
    } = {
      username: "",
      email: "",
      password: "",
    };

    if (!formData.username.trim()) {
      newErrors.username = "Please fill out the first name field";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please fill out the email field";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please fill a valid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password Required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => error === "");
  };

  const handleClick = async () => {
    if (validateForm()) {
      const success = await keygen(
        formData.username,
        formData.email,
        formData.password
      );
      if (success) {
        window.alert("Key Generated Successfully");
      } else {
        window.alert("Failed to generate keys");
      }
      const hashValue = await getHashValue(formData.password);
      if (hashValue.success) {
        const userdata = {
          name: formData.username,
          email: formData.email,
          password: hashValue.data,
        };
        saveToLocalStorage(formData.email, JSON.stringify(userdata));
      } else {
        window.alert(hashValue.error);
      }
    }
  };

  return (
    <>
      <div className="w-full">
        <p className="mb-6 text-start" style={{ fontWeight: "bold" }}>
          Register
        </p>
      </div>
      <form
        className="w-full max-w-lg mx-auto"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              username
            </label>
            <input
              className={clsx(
                "appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500",
                {
                  "border-red-500": errors.username.length > 0,
                }
              )}
              id="username"
              name="username"
              type="text"
              placeholder="Name"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <p className="text-red-500 text-xs italic">{errors.username}</p>
        </div>

        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              E-mail
            </label>
            <input
              className={clsx(
                "appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500",
                {
                  "border-red-500": errors.email.length > 0,
                }
              )}
              id="email"
              name="email"
              type="text"
              placeholder="rahasak@gmail.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <p className="text-red-500 text-xs italic">{errors.email}</p>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Password
            </label>
            <input
              className={clsx(
                "appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500",
                {
                  "border-red-500": errors.password.length > 0,
                }
              )}
              id="grid-password"
              name="password"
              type="password"
              placeholder="******************"
              value={formData.password}
              onChange={handleChange}
            />
            <p className="text-gray-600 text-xs italic">
              Make it as long and as crazy as you'd like
            </p>
            <p className="text-red-500 text-xs italic">{errors.password}</p>
          </div>
        </div>
        <button
          className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mb-4"
          onClick={handleClick}
          style={{ borderRadius: "6px" }}
        >
          Register
        </button>
      </form>
      <hr className="w-96 h-px my-8 bg-gray-200 border-0 dark:bg-gray-300" />
      <div className="mt-4 flex flex-row ">
        <p>Already have an Account</p>
        <Link href={"/login"} className="ml-2" style={{ color: "#007AFF" }}>
          Login now
        </Link>
      </div>
    </>
  );
}
