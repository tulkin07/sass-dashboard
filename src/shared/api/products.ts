import { apiClient } from "./client";
import type { PaginatedResponse, Product, ProductCategory } from "@/shared/types/api";

const BASE_URL = "https://dummyjson.com";

export async function fetchProducts(params?: {
  limit?: number;
  skip?: number;
  q?: string;
  category?: string;
}) {
  const { limit = 30, skip = 0, q, category } = params || {};

  let url: string;
  if (q) {
    url = `${BASE_URL}/products/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`;
  } else if (category) {
    url = `${BASE_URL}/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`;
  } else {
    url = `${BASE_URL}/products?limit=${limit}&skip=${skip}`;
  }

  const { data } = await apiClient.get<PaginatedResponse<Product>>(url);
  let products = data.products || [];

  if (q && category) {
    products = products.filter((product) => product.category === category);
  }

  return {
    products,
    total: q && category ? products.length : data.total,
    skip: data.skip,
    limit: data.limit,
  };
}

export async function fetchAllProducts() {
  const { data } = await apiClient.get<PaginatedResponse<Product>>(
    `${BASE_URL}/products?limit=0`
  );
  return data.products || [];
}

export async function fetchProductCategories() {
  const { data } = await apiClient.get<ProductCategory[]>(`${BASE_URL}/products/categories`);
  return data;
}
