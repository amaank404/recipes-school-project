import { Metadata } from "next";
import AboutContent from "./aboutcontent";

export const metadata: Metadata = {
  title: "About | Recipes.com",
};

export default function AboutPage() {
  return <AboutContent />;
}
