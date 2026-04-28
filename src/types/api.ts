export interface ApiUser {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: 'ADMIN' | 'USER';
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; role: string };
}

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryInfo {
  id: string;
  name: string;
  slug: string;
}

export interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  priceUSD: number;
  categoryId: string | null;
  category: CategoryInfo | null;
  imageUrl: string | null;
  stock: number;
  isActive: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  slug?: string;
  description?: string;
  price: number;
  categoryId?: string;
  imageUrl?: string;
  stock?: number;
  active?: boolean;
  featured?: boolean;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ApiOrder {
  id: string;
  customerName: string;
  phone: string;
  items: OrderItem[];
  total: number;
  deliveryMethod: 'DOMICILIO' | 'RECOGER';
  address: string | null;
  notes: string | null;
  status: 'PENDING' | 'CONFIRMED' | 'DELIVERED' | 'CANCELLED';
  userId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderInput {
  customerName: string;
  phone: string;
  items: OrderItem[];
  total: number;
  deliveryMethod: 'DOMICILIO' | 'RECOGER';
  address?: string;
  notes?: string;
}

export interface ApiReview {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  comment: string | null;
  approved: boolean;
  createdAt: string;
}

export interface CreateReviewInput {
  productId: string;
  authorName: string;
  rating: number;
  comment?: string;
}