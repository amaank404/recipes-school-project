import "@/app/globals.css";

import OutlinedInput from "../ui/input/outlined_input";

export default function TestPage() {
  return (
    <div className="flex p-10">
      <OutlinedInput placeholder="Email" />
    </div>
  );
}
