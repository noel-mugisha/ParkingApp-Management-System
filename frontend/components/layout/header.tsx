"use client";

import React, { FC } from "react";
import { Menu } from "lucide-react";
import ProfileDropdown from "./profile-dropdown";
import { useApp } from "@/contexts/app/app-context";

type props = {
  setIsSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const Header: FC<props> = ({ setIsSheetOpen }) => {
  const { user } = useApp()

  return (
    <nav className="sticky top-0 z-50 bg-[#F6F7F8] pt-4">
      <div className="flex items-center justify-between p-4 bg-white backdrop-blur-md rounded-t-2xl">
        <div className="flex items-center gap-5">
          <div
            className="p-3 hover:bg-primary/25 rounded-full bg-slate-200 block xl:hidden"
            onClick={() => setIsSheetOpen(true)}
          >
            <Menu fontSize={32} className="text-primary" />
          </div>
          <div className="flex flex-col gap-x-4">
            <p className="text-[#0A1629] text-lg font-semibold">Welcome back, {user?.firstName} {user?.lastName} 👋</p>
          </div>
        </div>

        <div className="flex items-center gap-x-4">
          {/* <MainSearch /> */}
          <ProfileDropdown />
        </div>
      </div>
    </nav>
  );
};

export default Header;
