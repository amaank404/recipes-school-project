"use client";

import { AuthAction } from "./types";
import { auth } from "./repository";

export function checkAuthAction(action: AuthAction): string {
  if (action.type === "href") {
    window.location.href = action.value;
  } else if (action.type === "token") {
    return action.value;
  }
  return "";
}

export async function doAuthToken(): Promise<string> {
  let token = checkAuthAction(
    await auth(
      localStorage.getItem("password") || "",
      localStorage.getItem("token") || ""
    )
  );

  localStorage.setItem("token", token);
  return token;
}
