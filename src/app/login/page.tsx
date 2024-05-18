"use client";

import { Input } from "@/components/ui/input";
import React from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";

const Login = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const handleLogin = () => {
    if (username == "") return toast.error("Username is required");
    if (password == "") return toast.error("Password is required");
    if (
      username != process.env.NEXT_PUBLIC_USERNAME ||
      password != process.env.NEXT_PUBLIC_PASSWORD
    )
      return toast.error("Invalid credentials");

    Cookies.set("auth", "true");
    toast.success("Login successful");
    window.location.href = "/dashboard";
  };
  return (
    <div className="flex justify-center h-screen w-screen bg-silver p-10">
      <h1 className="text-5xl font-bold w-full text-center">
        ATTENDANCE MANAGER
      </h1>
      <div className="bg-white p-5 rounded-lg mt-5 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <h2 className="text-2xl">Admin Login</h2>
        <form
          className="flex flex-col mt-5"
          onSubmit={(e) => e.preventDefault()}
        >
          <label htmlFor="username">Username</label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="password">Password</label>
          <Input
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            onClick={() => handleLogin()}
            className="bg-blue-500 text-white p-2 rounded-md mt-3"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
