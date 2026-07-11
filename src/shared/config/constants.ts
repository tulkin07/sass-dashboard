export const NAV_GROUPS = [
  {
    labelKey: "main",
    items: [
      { href: "/", labelKey: "dashboard", icon: "LayoutDashboard" },
      { href: "/analytics", labelKey: "analytics", icon: "BarChart3" },
    ],
  },
  {
    labelKey: "management",
    items: [
      { href: "/users", labelKey: "users", icon: "Users" },
      { href: "/products", labelKey: "products", icon: "Package" },
      { href: "/orders", labelKey: "orders", icon: "ShoppingCart" },
    ],
  },
  {
    labelKey: "system",
    items: [
      { href: "/settings", labelKey: "settings", icon: "Settings" },
    ],
  },
] as const;

export const NAV_ITEMS = [
  ...NAV_GROUPS[0].items,
  ...NAV_GROUPS[1].items,
  ...NAV_GROUPS[2].items,
] as const;

export const DEFAULT_PAGE_SIZE = 10;
