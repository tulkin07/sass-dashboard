export interface PaginatedResponse<T> {
  total: number;
  skip: number;
  limit: number;
  users?: T[];
  products?: T[];
  carts?: T[];
  posts?: T[];
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  maidenName?: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  image: string;
  company: {
    name: string;
    title: string;
    department: string;
  };
  address: {
    city: string;
    state: string;
    country: string;
  };
}

export interface ProductCategory {
  slug: string;
  name: string;
  url: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  thumbnail: string;
  images: string[];
}

export interface CartProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  thumbnail: string;
}

export interface Cart {
  id: number;
  products: CartProduct[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
}

export interface Country {
  name: {
    common: string;
    official: string;
  };
  population: number;
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
}

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export type UserStatus = "active" | "inactive" | "pending";

export type ProductPublishStatus = "published" | "draft";

export type ProductStockLevel = "in_stock" | "low_stock" | "out_of_stock";

export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  averageRating: number;
  lowStockProducts: number;
}
