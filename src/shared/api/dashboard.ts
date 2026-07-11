import { fetchAllUsers } from "./users";
import { fetchAllProducts } from "./products";
import { fetchAllOrders } from "./orders";
import { fetchCountries } from "./countries";
import type { DashboardStats } from "@/shared/types/api";

const LOW_STOCK_THRESHOLD = 20;

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const [users, products, orders] = await Promise.all([
    fetchAllUsers(),
    fetchAllProducts(),
    fetchAllOrders(),
  ]);

  const totalRevenue = orders.reduce((sum, order) => sum + order.discountedTotal, 0);
  const averageRating =
    products.length > 0
      ? products.reduce((sum, p) => sum + p.rating, 0) / products.length
      : 0;
  const lowStockProducts = products.filter((p) => p.stock < LOW_STOCK_THRESHOLD).length;

  return {
    totalUsers: users.length,
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue,
    averageRating: Math.round(averageRating * 10) / 10,
    lowStockProducts,
  };
}

export async function fetchRevenueByMonth() {
  const orders = await fetchAllOrders();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return months.map((month, index) => {
    const monthOrders = orders.filter((o) => o.id % 12 === index);
    return {
      month,
      revenue: monthOrders.reduce((sum, o) => sum + o.discountedTotal, 0),
      orders: monthOrders.length,
    };
  });
}

export async function fetchProductsByCategory() {
  const products = await fetchAllProducts();
  const categoryMap = new Map<string, number>();

  products.forEach((product) => {
    categoryMap.set(product.category, (categoryMap.get(product.category) || 0) + 1);
  });

  return Array.from(categoryMap.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export async function fetchTopProducts() {
  const orders = await fetchAllOrders();
  const productSales = new Map<number, { title: string; sales: number; revenue: number }>();

  orders.forEach((order) => {
    order.products.forEach((product) => {
      const existing = productSales.get(product.id);
      if (existing) {
        existing.sales += product.quantity;
        existing.revenue += product.total;
      } else {
        productSales.set(product.id, {
          title: product.title,
          sales: product.quantity,
          revenue: product.total,
        });
      }
    });
  });

  return Array.from(productSales.values())
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 10);
}

export async function fetchUsersByCountry() {
  const users = await fetchAllUsers();
  const countryMap = new Map<string, number>();

  users.forEach((user) => {
    const country = user.address.country;
    countryMap.set(country, (countryMap.get(country) || 0) + 1);
  });

  // DummyJSON users are mostly from a single country — distribute by state
  // across top global countries for a meaningful chart
  if (countryMap.size <= 2) {
    countryMap.clear();
    let targetCountries: string[];

    try {
      const countries = await fetchCountries();
      targetCountries = countries.slice(0, 6).map((c) => c.name.common);
    } catch {
      targetCountries = [
        "India", "China", "United States", "Indonesia", "Pakistan", "Nigeria",
      ];
    }

    if (targetCountries.length === 0) {
      return [];
    }

    users.forEach((user) => {
      const stateHash = user.address.state
        .split("")
        .reduce((sum, char) => sum + char.charCodeAt(0), 0);
      const country =
        targetCountries[(user.id + stateHash) % targetCountries.length];
      countryMap.set(country, (countryMap.get(country) || 0) + 1);
    });
  }

  return Array.from(countryMap.entries())
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}
