"use client";

import { useState } from "react";
import clsx from "clsx";
import { keygen } from "../lib/openpgp";

export default function KeyGenForm() {
  const [formData, setFormData] = useState({
    first_name: "sathindu",
    last_name: "de zoysa",
    email: "sathindu.d.zoysa@gmail.com",
    password: "123456",
  });

  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors: {
      first_name: string;
      last_name: string;
      email: string;
      password: string;
    } = {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    };

    if (!formData.first_name.trim()) {
      newErrors.first_name = "Please fill out the first name field";
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "Please fill out the last name field";
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

    return Object.keys(newErrors).some((error) => error !== "");
  };

  const handleClick = async () => {
    if (validateForm()) {
      const success = await keygen(
        formData.first_name,
        formData.email,
        formData.password
      );
      if (success) {
        window.alert("Key Generated Successfully");
      } else {
        window.alert("Failed to generate keys");
      }
    }
  };

  return (
    <>
      <form
        className="w-full max-w-lg mx-auto"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              First Name
            </label>
            <input
              className={clsx(
                "appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500",
                {
                  "border-red-500": errors.first_name.length > 0,
                }
              )}
              id="grid-first-name"
              name="first_name"
              type="text"
              placeholder="rahsak"
              value={formData.first_name}
              onChange={handleChange}
            />
            <p className="text-red-500 text-xs italic">{errors.first_name}</p>
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Last Name
            </label>
            <input
              className={clsx(
                "appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4  mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500",
                {
                  "border-red-500": errors.last_name.length > 0,
                }
              )}
              id="grid-last-name"
              name="last_name"
              type="text"
              placeholder="Doe"
              value={formData.last_name}
              onChange={handleChange}
            />
            <p className="text-red-500 text-xs italic">{errors.last_name}</p>
          </div>
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
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleClick}
        >
          Create Keys
        </button>
      </form>
    </>
  );
}
