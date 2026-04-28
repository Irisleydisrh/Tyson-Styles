import { api } from "@/lib/api-client";
import type { ApiOrder } from "@/types/api";

export type { ApiOrder as Order };

interface PaginatedResponse<T> {
  data: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

async function extractData<T>(response: ApiOrder[] | PaginatedResponse<T>): Promise<ApiOrder[]> {
  if (Array.isArray(response)) return response;
  return (response as PaginatedResponse<T>).data;
}

export async function fetchOrders(): Promise<ApiOrder[]> {
  const response = await api.get<PaginatedResponse<ApiOrder> | ApiOrder[]>('/api/orders');
  return extractData(response);
}

export async function fetchMyOrders(): Promise<ApiOrder[]> {
  const response = await api.get<PaginatedResponse<ApiOrder> | ApiOrder[]>('/api/orders/my');
  return extractData(response);
}

export async function createOrder(data: {
  customerName: string;
  phone: string;
  items: any[];
  total: number;
  deliveryMethod: string;
  address?: string;
  notes?: string;
}) {
  return api.post<ApiOrder>('/api/orders', data);
}

export async function updateOrderStatus(id: string, status: string, motivo?: string) {
  return api.patch(`/api/orders/${id}/status`, { status, motivo });
}