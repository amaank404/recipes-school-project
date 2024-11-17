"use client";

import Button from "@/app/ui/input/button";
import OutlinedInput from "@/app/ui/input/outlined_input";
import { useState } from "react";

export default function LoginContent() {
  let [password, setPassword] = useState("");

  function submit() {
    localStorage.setItem("password", password);
    window.location.href = "/admin";
  }

  return (
    <div className="w-screen h-screen bg-slate-100 flex items-center justify-center">
      <div className="rounded-xl bg-white shadow-md p-8 flex flex-col gap-5">
        <div className="text-3xl font-semibold">Admin Login </div>
        <OutlinedInput
          placeholder="Password"
          password
          onBlur={(evt) => setPassword(evt.target.value)}
          className="w-72"
        />
        <Button color="blue" label="Submit" onClick={submit} />
      </div>
    </div>
  );
}
