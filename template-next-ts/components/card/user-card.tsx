import { cn } from "@/lib/utils";
import { FC } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";

type props = {
  isCollapsed?: boolean;
  size?: "large" | "small";
  firstName?: string;
  lastName?: string;
  email?: string;
};
const UserCard: FC<props> = ({
  isCollapsed,
  size = "large",
  firstName,
  lastName,
  email,
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-[14px] hover:bg-neutral-50 rounded-lg p-2 cursor-pointer"
      )}
    >
      <Avatar className="w-14 h-14">
        <AvatarFallback className="text-xl">
          {firstName && lastName && `${firstName[0]}${lastName[0]}`}
        </AvatarFallback>
      </Avatar>
      {!isCollapsed && (
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-medium leading-[16px] text-black whitespace-nowrap">
            {firstName} {lastName}
          </h2>
          <p className="text-[#343E4A] text-xs font-normal">{email}</p>
        </div>
      )}
    </div>
  );
};

export default UserCard;
