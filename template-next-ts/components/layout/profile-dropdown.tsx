import { Icon } from "@iconify/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UtilsService } from "@/services/utils.service";
import Link from "next/link";

const ProfileDropdown = () => {
  const utils = new UtilsService();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="cursor-pointer focus:outline-none"
        asChild
      >
        <Icon
          color="#343E4A"
          className="text-[2rem] hover:text-gray-600 transition-colors duration-200"
          icon={"carbon:user-avatar-filled-alt"}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={`/dashboard/profile`}>
            <DropdownMenuItem className="!cursor-pointer">
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
          <Link href={`/dashboard/profile`}>
            <DropdownMenuItem className="!cursor-pointer">
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => utils.handleUnauthorized()}
        >
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
