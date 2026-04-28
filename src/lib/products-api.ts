import { api } from "@/lib/api-client";
import type { ApiCategory, ApiProduct } from "@/types/api";

export type { ApiCategory as Category, ApiProduct as Product };

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

async function extractData<T>(response: ApiProduct[] | PaginatedResponse<ApiProduct>): Promise<ApiProduct[]> {
  if (Array.isArray(response)) {
    return response;
  }
  // Handle paginated response from backend
  return (response as PaginatedResponse<ApiProduct>).data;
}

export async function fetchCategories(): Promise<ApiCategory[]> {
  return api.get<ApiCategory[]>('/api/categories');
}

export async function fetchProducts(): Promise<ApiProduct[]> {
  const response = await api.get<PaginatedResponse<ApiProduct> | ApiProduct[]>('/api/products');
  return extractData(response);
}

export async function fetchAllProducts(): Promise<ApiProduct[]> {
  const response = await api.get<PaginatedResponse<ApiProduct> | ApiProduct[]>('/api/products?includeInactive=true');
  return extractData(response);
}

export async function fetchProductBySlug(slug: string): Promise<ApiProduct | null> {
  try {
    return await api.get<ApiProduct>(`/api/products/${slug}`);
  } catch {
    return null;
  }
}

export async function createProduct(data: {
  name: string;
  slug?: string;
  description?: string;
  priceUSD: number;
  categoryId?: string;
  imageUrl?: string;
  stock?: number;
  isActive?: boolean;
  featured?: boolean;
}) {
  const res = await api.post<{ message?: string }>('/api/products', data);
  return res;
}

export async function updateProduct(id: string, data: {
  name?: string;
  slug?: string;
  description?: string;
  priceUSD?: number;
  categoryId?: string;
  imageUrl?: string;
  stock?: number;
  isActive?: boolean;
  featured?: boolean;
}) {
  return api.patch(`/api/products/${id}`, data);
}

export async function deleteProduct(id: string) {
  return api.delete(`/api/products/${id}`);
}

export async function uploadProductImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  // Use session storage for admin auth (SSR-safe)
  const token = typeof window !== 'undefined' && typeof sessionStorage !== 'undefined' 
    ? sessionStorage.getItem('adminToken') || '' 
    : '';
  const response = await fetch('http://localhost:3001/api/upload/image', {
    method: 'POST',
    headers: token ? {
      Authorization: `Bearer ${token}`,
    } : {},
    body: formData,
  });
  const data = await response.json();
  return data.url;
}