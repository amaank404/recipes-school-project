import { Metadata } from "next";
import LoginContent from "./login_content";

const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return <LoginContent />;
}
