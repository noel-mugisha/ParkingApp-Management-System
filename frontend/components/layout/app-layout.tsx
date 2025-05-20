"use client";

import { useState } from "react";
import DashboardSidebar from "./sidebar";
import Header from "@/components/layout/header";
import { DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, _setIsClient] = useState(true);
  const [isSidebar, _setIsSidebar] = useState(true);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  return (
    <main className="flex h-screen pb-4 pl-4 bg-[#F6F7F8] gap-3.5 fixed top-0 w-full overflow-y-auto scrollbar border">
      {isSidebar && (
        <div className="pt-4 sticky top-0 hidden xl:block ">
          <section
            className={`transition-all duration-300 sticky top-0 hidden xl:block ${
              isSidebarMinimized ? "w-[80px]" : "w-[274px]"
            } h-[calc(100vh-32px)] bg-white rounded-2xl`}
          >
            <DashboardSidebar
              setIsSidebarMinimized={setIsSidebarMinimized}
              setIsSheetOpen={setIsOpen}
              isSidebarMinimized={isSidebarMinimized}
            />
          </section>
        </div>
      )}
      {isClient && (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side={"left"} className="px-0 w-[274px]">
            <DialogTitle className="hidden"></DialogTitle>
            <DashboardSidebar
              setIsSidebarMinimized={setIsSidebarMinimized}
              setIsSheetOpen={setIsOpen}
              isSidebarMinimized={isSidebarMinimized}
            />
          </SheetContent>
        </Sheet>
      )}
      <div className="rounded-2xl flex-1 h-full overflow-x-hidden pr-4">
        <div className="max-w-full flex flex-col gap-y-3.5">
          <Header setIsSheetOpen={setIsOpen} />
          <div className="p-4 rounded-b-2xl bg-white min-h-[calc(100vh-125px)]">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
