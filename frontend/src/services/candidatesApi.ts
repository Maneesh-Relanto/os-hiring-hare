import api from './api';

export interface CandidateCreate {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  requirement_id: string;
  status?: string;
  resume_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  current_company?: string;
  current_title?: string;
  total_experience_years?: string;
  skills?: Record<string, any>;
  source?: string;
  notes?: string;
  assigned_recruiter_id?: string;
}

export interface Candidate extends CandidateCreate {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface CandidatesListResponse {
  items: Candidate[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export const candidatesApi = {
  // List candidates with pagination and filters
  list: async (params?: {
    skip?: number;
    limit?: number;
    status?: string;
    requirement_id?: string;
    search?: string;
  }): Promise<CandidatesListResponse> => {
    const response = await api.get('/api/v1/candidates', { params });
    return response.data;
  },

  // Get single candidate
  get: async (id: string): Promise<Candidate> => {
    const response = await api.get(`/api/v1/candidates/${id}`);
    return response.data;
  },

  // Create candidate
  create: async (data: CandidateCreate): Promise<Candidate> => {
    const response = await api.post('/api/v1/candidates', data);
    return response.data;
  },

  // Update candidate
  update: async (id: string, data: Partial<CandidateCreate>): Promise<Candidate> => {
    const response = await api.put(`/api/v1/candidates/${id}`, data);
    return response.data;
  },

  // Delete candidate
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/candidates/${id}`);
  },
};
