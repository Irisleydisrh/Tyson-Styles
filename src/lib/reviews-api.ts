import { api } from "@/lib/api-client";
import type { ApiReview, CreateReviewInput } from "@/types/api";

export type { ApiReview as Review };

export async function fetchReviews(productId: string): Promise<ApiReview[]> {
  return api.get<ApiReview[]>(`/api/reviews/product/${productId}`);
}

export async function createReview(input: CreateReviewInput) {
  return api.post('/api/reviews', input);
}