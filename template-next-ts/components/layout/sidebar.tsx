import Link from "next/link";
import { Icon } from "@iconify/react";
import { jwtDecode } from "jwt-decode";
import { Cookies } from "react-cookie";
import React, { useState } from "react";
import { useApp } from "@/contexts/app/app-context";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getNavItems } from "@/utils/getNavItems";
import UserCard from "@/components/card/user-card";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";

interface Props {
  setIsSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSidebarMinimized: boolean;
  setIsSidebarMinimized: React.Dispatch<React.SetStateAction<boolean>>;
}

const DashboardSidebar: React.FC<Props> = ({
  setIsSheetOpen,
  isSidebarMinimized,
  setIsSidebarMinimized,
}) => {
  const token = new Cookies().get("accessToken");
  const decodedToken: any = jwtDecode(token);
  const role = decodedToken.role;

  const { user } = useApp();
  const pathName = usePathname();
  const navItems = getNavItems(role);
  const [expandedItem, setExpandedItem] = useState<string | undefined>(
    undefined
  );

  const handleNavItemClick = (itemName: string) => {
    if (isSidebarMinimized) {
      setIsSidebarMinimized(false);
      setExpandedItem(itemName);
    } else {
      setExpandedItem(expandedItem === itemName ? undefined : itemName);
    }
  };

  const renderNavItem = (item: NavItem) => {
    const isActive =
      pathName === `${item.href}` ||
      item.subItems?.some((subItem) =>
        pathName.startsWith(`/${subItem.href}`)
      );

    const isExpanded = expandedItem === item.name;

    if (item.subItems) {
      return (
        <AccordionItem
          key={item.name}
          value={item.name}
          className="border-none"
        >
          <AccordionTrigger
            className={`text-sm transition duration-300 hover:bg-primary hover:text-white h-[44px] px-3 rounded-lg text-[#494C52] w-full flex items-center justify-between gap-2 font-medium cursor-pointer ${
              isActive ? "bg-primary text-white relative" : ""
            }`}
            onClick={() => handleNavItemClick(item.name)}
          >
            <div
              className={`flex items-center gap-2 ${
                isSidebarMinimized ? "absolute w-full z-50" : ""
              }`}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <Icon icon={item.icon as string} fontSize={24} />
              </div>
              {!isSidebarMinimized && item.name}
            </div>
          </AccordionTrigger>
          {!isSidebarMinimized && isExpanded && (
            <AccordionContent className="">
              <ol className="relative flex mt-2 w-full transition duration-300 ml-12">
                <div className="w-[2px] py-2">
                  <div className="w-full h-full bg-[#494C52]"></div>
                </div>
                <div>
                  {item.subItems.map((subItem, index) => {
                    const isSubItemActive = pathName.includes(
                      `/${subItem.href}`
                    );
                    const isLastSubItem = index === item.subItems!.length - 1;
                    return (
                      <li
                        key={subItem.name}
                        className={`${!isLastSubItem ? "mb-4" : ""}`}
                      >
                        <div
                          className={`absolute w-[10px] h-[10px] rounded-full mt-1.5 -start-1 border border-white ${
                            isSubItemActive ? "bg-primary" : "bg-[#494C52]"
                          }`}
                        ></div>
                        <Link
                          href={subItem.href!}
                          className={`text-[13px] transition duration-300 hover:text-primary ml-3 -mt-2 ${
                            isSubItemActive ? "text-primary" : "text-[#494C52]"
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    );
                  })}
                </div>
              </ol>
            </AccordionContent>
          )}
        </AccordionItem>
      );
    } else {
      return (
        <Link
          href={item.href!}
          key={item.name}
          className={`text-sm transition duration-300 hover:bg-primary hover:text-white h-[44px] px-3 rounded-lg text-[#494C52] w-full flex items-center justify-between gap-2 font-medium ${
            isActive ? "bg-primary text-white relative" : ""
          }`}
        >
          <div
            className={`flex items-center gap-2 ${
              isSidebarMinimized ? "absolute w-full z-50" : ""
            }`}
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <Icon icon={item.icon as string} fontSize={24} />
            </div>
            {!isSidebarMinimized && item.name}
          </div>
        </Link>
      );
    }
  };

  return (
    <main
      className={`bg-white h-full w-full pt-4 pb-[3rem] max-h-[1024px] flex flex-col rounded-2xl ${
        isSidebarMinimized ? "" : "min-w-[264px]"
      }`}
    >
      <div className="text-primary text-xl font-semibold px-[1rem]">Logo</div>
      <button
        className="absolute -right-2.5 top-10 transform translate-y-[-50%] bg-primary text-white rounded-full w-8 h-8 hidden xl:flex items-center justify-center shadow-md hover:bg-primary-dark transition cursor-pointer"
        onClick={() => setIsSidebarMinimized(!isSidebarMinimized)}
      >
        <Icon
          icon={isSidebarMinimized ? "mdi:chevron-right" : "mdi:chevron-left"}
          fontSize={24}
        />
      </button>

      <Accordion
        type="single"
        collapsible
        className="w-full flex-1 mt-10 space-y-2 px-[1rem]"
        value={expandedItem}
        onValueChange={setExpandedItem}
      >
        {navItems.slice(0, 6).map(renderNavItem)}
      </Accordion>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 px-[1rem]">
          {navItems.slice(6).map(renderNavItem)}
        </div>
        <Separator orientation="horizontal" className="bg-primary/5 my-2" />
        <div className={"px-1"}>
          <UserCard
            isCollapsed={isSidebarMinimized}
            firstName={user?.firstName || ""}
            lastName={user?.lastName || ""}
            email={user?.email || ""}
          />
        </div>
      </div>
    </main>
  );
};

export default DashboardSidebar;
