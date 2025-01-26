"use client";

import { isMatch } from "@/app/lib/hash";
import clsx from "clsx";
import { redirect } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { storeUserState } from "../lib/seesion_coockie";
import { getFromLocalStorage } from "../lib/local_storage_manager";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "sathindu.d.zoysa@gmail.com",
    password: "123456",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ email: "", password: "" });
  };

  const validateForm = (): boolean => {
    const newErrors: {
      email: string;
      password: string;
    } = {
      email: "",
      password: "",
    };

    if (!formData.email.trim()) {
      newErrors.email = "Please type you email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password Required";
    }

    setErrors(newErrors);

    return Object.values(newErrors).every((value) => value === "");
  };

  const handleClick = () => {
    let isFormValid = false;
    isFormValid = validateForm();

    console.log(isFormValid);
    if (!isFormValid) {
      return;
    }

    isMatch(formData.email, formData.password).then((check) => {
      if (check.success) {
        storeUserState("userSession", JSON.stringify(check.data), 1);
        window.alert("Login Sucessfull.");
        redirect("/dashboard");
      } else {
        window.alert(check.error);
      }
    });
  };

  return (
    <>
      <div className="w-full">
        <p className="mb-6 text-start" style={{ fontWeight: "bold" }}>
          Nice to see you again
        </p>
      </div>
      <form
        className="w-full max-w-lg mx-auto"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Login
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
              placeholder="Email"
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

            <p className="text-red-500 text-xs italic">{errors.password}</p>
          </div>
        </div>
        <button
          id="login"
          className="background-color: #007AFF; hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mb-4"
          onClick={handleClick}
          style={{ borderRadius: "6px" }}
        >
          Sign-in
        </button>
      </form>
      <hr className="w-96 h-px my-8 bg-gray-200 border-0 dark:bg-gray-300" />
      <div className="mt-4 flex flex-row ">
        <p>Dont have an account</p>
        <Link
          href={"/login/register"}
          className="ml-2"
          style={{ color: "#007AFF" }}
        >
          Sign up now
        </Link>
      </div>
    </>
  );
}
