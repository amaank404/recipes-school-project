"use client";

import { useRouter } from "next/navigation";

function NavBarItem({
  label,
  action,
  icon,
}: {
  label?: string;
  action?: () => void;
  icon: string;
}) {
  let label_content: string = label || "Unknown";
  return (
    <div
      className="flex text-xl font-semibold p-4 gap-4 cursor-pointer flex-nowrap text-nowrap bg-black bg-opacity-0 hover:bg-opacity-25 active:bg-opacity-40"
      onClick={action}
    >
      <div className="material-symbols-rounded text-2xl select-none font-normal">
        {" "}
        {icon}{" "}
      </div>
      {label_content}
    </div>
  );
}

export default function NavBar() {
  const router = useRouter();

  return (
    // <div className="z-10 fixed max-sm:w-full top-0 sm:top-5 sm:-translate-x-1/2 sm:-translatey-1/2 sm:left-1/2 text-white backdrop-blur-sm sm:rounded-full overflow-hidden flex bg-black bg-opacity-25">
    //   <NavBarItem
    //     label="Search"
    //     icon="search"
    //     action={() => router.push("search")}
    //   />
    // </div>

    <div className="z-10 fixed left-0 top-[50vh] text-white bg-black bg-opacity-50 backdrop-blur-sm -translate-y-1/2 transition-all w-14 hover:w-36 rounded-r-2xl overflow-hidden">
      <div>
        <NavBarItem
          label="Search"
          icon="search"
          action={() => router.push("search")}
        />
        <NavBarItem
          label="About"
          icon="info"
          action={() => router.push("/about")}
        />
        <NavBarItem
          label="Admin"
          icon="admin_panel_settings"
          action={() => router.push("/admin")}
        />
      </div>
    </div>
  );
}
