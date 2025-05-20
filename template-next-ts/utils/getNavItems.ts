// Define user roles
type UserRole = "User" | "Admin" | "ParkingAttendant";

// Common navigation items that might be shared across roles
const COMMON_NAV_ITEMS: NavItem[] = [
  {
    name: "Available Parking Lots",
    icon: "mdi:parking",
    href: "/dashboard/available-parking",
  },
];

// Role-specific navigation items
const ROLE_SPECIFIC_NAV_ITEMS: Partial<Record<UserRole, NavItem[]>> = {
  ParkingAttendant: [
    {
      name: "Car Entry",
      icon: "mdi:car",
      href: "/dashboard/car-entry",
    },
    {
      name: "Car Report",
      icon: "mdi:chart-box",
      href: "/dashboard/report",
    },
  ],
  Admin: [
    {
      name: "Manage Parking",
      icon: "mdi:cog",
      href: "/dashboard/admin/parking",
    },
    {
      name: "Car Report",
      icon: "mdi:chart-box",
      href: "/dashboard/report",
    },
  ],
};

// Main function to get navigation items based on role
export function getNavItems(role: UserRole): NavItem[] {
  const commonItems = COMMON_NAV_ITEMS || [];
  const specificItems = ROLE_SPECIFIC_NAV_ITEMS[role] || [];

  return [...commonItems, ...specificItems];
}