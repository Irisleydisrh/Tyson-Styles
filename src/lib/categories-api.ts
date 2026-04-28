import { api } from "@/lib/api-client";
import type { ApiCategory, CategoryInfo } from "@/types/api";

export type { Category, CategoryInfo } from "@/types/api";
export { ApiCategory as Category };

export async function fetchCategories(): Promise<ApiCategory[]> {
  return api.get<ApiCategory[]>('/api/categories');
}

export async function fetchCategoryBySlug(slug: string): Promise<ApiCategory | null> {
  try {
    return await api.get<ApiCategory>(`/api/categories/${slug}`);
  } catch {
    return null;
  }
}

export async function createCategory(data: {
  name: string;
  slug?: string;
  icon?: string;
  sortOrder?: number;
}) {
  return api.post('/api/categories', data);
}

export async function updateCategory(id: string, data: {
  name?: string;
  slug?: string;
  icon?: string;
  sortOrder?: number;
}) {
  return api.patch(`/api/categories/${id}`, data);
}

export async function deleteCategory(id: string) {
  return api.delete(`/api/categories/${id}`);
}