import { API_BASE_URL, ADMIN_API_KEY } from "@/lib/config";

// API Base URL - configurable via environment
const API_BASE = API_BASE_URL;
const API_KEY = ADMIN_API_KEY;

// eslint-disable-next-line no-unused-vars
function _checkEnvironment() {
  // This will be used in browser console
  return {
    apiUrl: API_BASE,
    hasApiKey: !!API_KEY,
  };
}

class ApiClient {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  setTokens(access: string, refresh: string) {
    this.accessToken = access;
    this.refreshToken = refresh;
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
    }
  }

  getTokens() {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('accessToken');
      this.refreshToken = localStorage.getItem('refreshToken');
    }
    return { access: this.accessToken, refresh: this.refreshToken };
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const { access } = this.getTokens();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (access) {
      headers['Authorization'] = `Bearer ${access}`;
    }

    // Add API key for admin endpoints
    if (path.includes('/orders') && (path.includes('/status') || path === '/api/orders')) {
      headers['x-api-key'] = API_KEY;
    }

    const url = `${API_BASE}${path}`;
    
    let response = await fetch(url, { ...options, headers });

    // Handle 401 with refresh
    if (response.status === 401 && this.refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_BASE}/api/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: this.refreshToken }),
        });

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          this.setTokens(data.accessToken, data.refreshToken);
          headers['Authorization'] = `Bearer ${data.accessToken}`;
          response = await fetch(`${API_BASE}${path}`, { ...options, headers });
        } else {
          this.clearTokens();
          if (typeof window !== 'undefined') {
            window.location.href = '/auth';
          }
        }
      } catch {
        this.clearTokens();
        window.location.href = '/auth';
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      console.error('API Error:', response.status, error);
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    try {
      return response.json();
    } catch {
      return {} as T;
    }
  }

  get<T>(path: string) {
    return this.request<T>(path);
  }

  post<T>(path: string, body: unknown) {
    return this.request<T>(path, { method: 'POST', body: JSON.stringify(body) });
  }

  patch<T>(path: string, body: unknown) {
    return this.request<T>(path, { method: 'PATCH', body: JSON.stringify(body) });
  }

  delete<T>(path: string) {
    return this.request<T>(path, { method: 'DELETE' });
  }

  isAuthenticated() {
    return !!this.getTokens().access;
  }
}

export const api = new ApiClient();