import api from './api';

export interface Role {
  id: string;
  name: string;
  display_name: string;
  description?: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  phone?: string;
  employee_id?: string;
  job_title?: string;
  department_id?: string;
  manager_id?: string;
  profile_picture_url?: string;
  is_active: boolean;
  is_superuser: boolean;
  email_verified: boolean;
  phone_verified: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
  roles: Role[];
}

export interface CreateUserData {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  phone?: string;
  employee_id?: string;
  job_title?: string;
  department_id?: string;
}

export interface UpdateUserData {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  employee_id?: string;
  job_title?: string;
  department_id?: string;
  manager_id?: string;
  profile_picture_url?: string;
  is_active?: boolean;
}

export const usersApi = {
  // List all users
  list: async (params?: { role?: string; is_active?: boolean }): Promise<User[]> => {
    const queryParams = new URLSearchParams();
    if (params?.role) queryParams.append('role', params.role);
    if (params?.is_active !== undefined) queryParams.append('is_active', String(params.is_active));
    
    const url = `/api/v1/users${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await api.get(url);
    return response.data;
  },

  // Get users by role
  getByRole: async (role: string): Promise<User[]> => {
    const response = await api.get(`/api/v1/users?role=${role}`);
    return response.data;
  },

  // Get single user
  get: async (id: string): Promise<User> => {
    const response = await api.get(`/api/v1/users/${id}`);
    return response.data;
  },

  // Create new user
  create: async (userData: CreateUserData, roleIds?: string[]): Promise<User> => {
    const params = roleIds && roleIds.length > 0 
      ? `?${roleIds.map(id => `role_ids=${id}`).join('&')}`
      : '';
    const response = await api.post(`/api/v1/users${params}`, userData);
    return response.data;
  },

  // Update user
  update: async (userId: string, userData: UpdateUserData): Promise<User> => {
    const response = await api.put(`/api/v1/users/${userId}`, userData);
    return response.data;
  },

  // Update user roles
  updateRoles: async (userId: string, roleIds: string[]): Promise<User> => {
    const response = await api.put(`/api/v1/users/${userId}/roles`, roleIds);
    return response.data;
  },

  // Delete user
  delete: async (userId: string): Promise<void> => {
    await api.delete(`/api/v1/users/${userId}`);
  },

  // Get available roles
  getRoles: async (): Promise<Role[]> => {
    const response = await api.get('/api/v1/roles');
    return response.data;
  },
};
