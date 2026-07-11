import { apiClient } from "./client";
import type { PaginatedResponse, User } from "@/shared/types/api";

const BASE_URL = "https://dummyjson.com";

export async function fetchUsers(params?: {
  limit?: number;
  skip?: number;
  q?: string;
}) {
  const { limit = 30, skip = 0, q } = params || {};

  const url = q
    ? `${BASE_URL}/users/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`
    : `${BASE_URL}/users?limit=${limit}&skip=${skip}`;

  const { data } = await apiClient.get<PaginatedResponse<User>>(url);
  return {
    users: data.users || [],
    total: data.total,
    skip: data.skip,
    limit: data.limit,
  };
}

export async function fetchAllUsers() {
  const { data } = await apiClient.get<PaginatedResponse<User>>(
    `${BASE_URL}/users?limit=0`
  );
  return data.users || [];
}
