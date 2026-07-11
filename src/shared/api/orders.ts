import { apiClient } from "./client";
import type { Cart, PaginatedResponse } from "@/shared/types/api";

const BASE_URL = "https://dummyjson.com";

export async function fetchOrders(params?: { limit?: number; skip?: number }) {
  const { limit = 30, skip = 0 } = params || {};
  const { data } = await apiClient.get<PaginatedResponse<Cart>>(
    `${BASE_URL}/carts?limit=${limit}&skip=${skip}`
  );
  return {
    orders: data.carts || [],
    total: data.total,
    skip: data.skip,
    limit: data.limit,
  };
}

export async function fetchAllOrders() {
  const { data } = await apiClient.get<PaginatedResponse<Cart>>(
    `${BASE_URL}/carts?limit=0`
  );
  return data.carts || [];
}
