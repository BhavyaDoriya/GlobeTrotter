const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('globetrotter_access_token');
}

export function setAuthTokens(accessToken: string, refreshToken?: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('globetrotter_access_token', accessToken);
  if (refreshToken) {
    localStorage.setItem('globetrotter_refresh_token', refreshToken);
  }
}

export function clearAuthTokens() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('globetrotter_access_token');
  localStorage.removeItem('globetrotter_refresh_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return {} as T;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || `Request failed with status ${response.status}`;
    throw new Error(Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg);
  }

  return data as T;
}

export const apiClient = {
  auth: {
    login: (credentials: { email: string; password: string }) =>
      request<{ accessToken: string; refreshToken: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),

    register: (userData: { email: string; password: string; firstName: string; lastName: string }) =>
      request<{ accessToken: string; refreshToken: string; user: any }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),

    me: () => request<any>('/users/me'),
  },

  trips: {
    list: () => request<any[]>('/trips'),

    getById: (id: string) => request<any>(`/trips/${id}`),

    create: (tripData: { name: string; description?: string; startDate: string; endDate: string; isPublic?: boolean }) =>
      request<any>('/trips', {
        method: 'POST',
        body: JSON.stringify(tripData),
      }),

    delete: (id: string) =>
      request<void>(`/trips/${id}`, {
        method: 'DELETE',
      }),
  },

  cities: {
    list: (query?: string) => request<any[]>(`/cities${query ? `?q=${encodeURIComponent(query)}` : ''}`),
    getById: (id: string) => request<any>(`/cities/${id}`),
  },

  sharing: {
    generateSlug: (tripId: string) =>
      request<{ shareSlug: string; shareUrl: string }>(`/trips/${tripId}/share`, {
        method: 'POST',
      }),
    getBySlug: (slug: string) => request<any>(`/trips/share/${slug}`),
  },

  activities: {
    add: (stopId: string, activityData: { activityId: string; scheduledDate?: string; scheduledTime?: string }) =>
      request<any>(`/stops/${stopId}/activities`, {
        method: 'POST',
        body: JSON.stringify(activityData),
      }),
  },

  budget: {
    updateLine: (lineId: string, amount: number) =>
      request<any>(`/budget/lines/${lineId}`, {
        method: 'PATCH',
        body: JSON.stringify({ amount }),
      }),
  },
};
