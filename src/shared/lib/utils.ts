import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, locale = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number, locale = "en-US"): string {
  return new Intl.NumberFormat(locale).format(value);
}

export function formatDate(date: string | Date, locale = "en-US"): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date, locale = "en-US"): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
}

export function getProductCreatedAt(productId: number): Date {
  const date = new Date(2024, 0, 1);
  date.setDate(date.getDate() + ((productId * 3) % 365));
  date.setHours((productId * 7) % 24);
  date.setMinutes((productId * 11) % 60);
  return date;
}

export function getProductPublishStatus(
  productId: number
): import("@/shared/types/api").ProductPublishStatus {
  return productId % 3 === 0 ? "draft" : "published";
}

export function getProductStockLevel(
  stock: number
): import("@/shared/types/api").ProductStockLevel {
  if (stock === 0) return "out_of_stock";
  if (stock < 20) return "low_stock";
  return "in_stock";
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function downloadCSV(data: Record<string, unknown>[], filename: string) {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          const stringValue = value == null ? "" : String(value);
          return `"${stringValue.replace(/"/g, '""')}"`;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function getOrderStatus(cartId: number): import("@/shared/types/api").OrderStatus {
  const statuses: import("@/shared/types/api").OrderStatus[] = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];
  return statuses[cartId % statuses.length];
}

export function getUserStatus(userId: number): import("@/shared/types/api").UserStatus {
  const statuses: import("@/shared/types/api").UserStatus[] = ["active", "inactive", "pending"];
  return statuses[userId % statuses.length];
}

export function calculateDiscountedPrice(price: number, discount: number): number {
  return price * (1 - discount / 100);
}
