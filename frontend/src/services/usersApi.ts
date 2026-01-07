import api from './api';

export interface Role {
  id: string;
  name: string;
  description?: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  roles: Role[];
  is_active: boolean;
  created_at: string;
}

export const usersApi = {
  // List all users
  list: async (): Promise<User[]> => {
    const response = await api.get('/api/v1/users');
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
};
