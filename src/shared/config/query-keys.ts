export const queryKeys = {
  users: {
    all: ["users"] as const,
    list: (params: Record<string, unknown>) => ["users", "list", params] as const,
    allData: () => ["users", "all"] as const,
  },
  products: {
    all: ["products"] as const,
    list: (params: Record<string, unknown>) => ["products", "list", params] as const,
    allData: () => ["products", "all"] as const,
    categories: () => ["products", "categories"] as const,
  },
  orders: {
    all: ["orders"] as const,
    list: (params: Record<string, unknown>) => ["orders", "list", params] as const,
    allData: () => ["orders", "all"] as const,
  },
  countries: {
    all: ["countries"] as const,
  },
  dashboard: {
    stats: () => ["dashboard", "stats"] as const,
    revenue: () => ["dashboard", "revenue"] as const,
    categories: () => ["dashboard", "categories"] as const,
    topProducts: () => ["dashboard", "topProducts"] as const,
    usersByCountry: () => ["dashboard", "usersByCountry"] as const,
  },
};
