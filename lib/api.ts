// API utility functions for frontend-backend communication

const API_BASE_URL = '/api';

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Course API functions
export const courseApi = {
  getAll: () => apiRequest<{ courses: any[] }>('/courses'),
  
  create: (courseData: any) => 
    apiRequest<{ course: any }>('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    }),
};

// Assignment API functions
export const assignmentApi = {
  getAll: (filter?: string, courseId?: string) => {
    const params = new URLSearchParams();
    if (filter) params.append('filter', filter);
    if (courseId) params.append('courseId', courseId);
    
    return apiRequest<{ assignments: any[] }>(`/assignments?${params}`);
  },
  
  create: (assignmentData: any) =>
    apiRequest<{ assignment: any }>('/assignments', {
      method: 'POST',
      body: JSON.stringify(assignmentData),
    }),
  
  update: (id: string, updateData: any) =>
    apiRequest<{ assignment: any }>(`/assignments?id=${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    }),
};

// Dashboard API functions
export const dashboardApi = {
  getStats: () => apiRequest<{ stats: any }>('/dashboard/stats'),
};

// Grade API functions
export const gradeApi = {
  getAll: (courseId?: string) => {
    const params = courseId ? `?courseId=${courseId}` : '';
    return apiRequest<{ grades: any[] }>(`/grades${params}`);
  },
  
  create: (gradeData: any) =>
    apiRequest<{ grade: any }>('/grades', {
      method: 'POST',
      body: JSON.stringify(gradeData),
    }),
};

// Error handling utility
export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

// Hook for handling API errors
export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};