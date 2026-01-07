import api from './api';

export interface RequirementCreate {
  position_title: string;
  department_id: string;
  job_level_id: string;
  location_id: string;
  reporting_to_user_id?: string;
  requirement_type: string;
  employment_type: string;
  work_mode: string;
  number_of_positions: number;
  priority: string;
  job_description: string;
  key_responsibilities?: string;
  required_qualifications: string;
  preferred_qualifications?: string;
  required_skills: Record<string, any>;
  min_salary?: number;
  max_salary?: number;
  currency?: string;
  additional_compensation?: string;
  target_start_date?: string;
  expected_closure_date?: string;
  justification: string;
}

export interface Requirement extends RequirementCreate {
  id: string;
  requirement_number: string;
  status: string;
  created_by: string;
  hiring_manager_id: string;
  assigned_recruiter_id?: string;
  created_at: string;
  updated_at: string;
  submitted_at?: string;
  approved_at?: string;
}

export interface RequirementsListResponse {
  items: Requirement[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export const requirementsApi = {
  // List requirements with pagination and filters
  list: async (params?: {
    skip?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<RequirementsListResponse> => {
    const response = await api.get('/api/v1/requirements', { params });
    return response.data;
  },

  // Get single requirement
  get: async (id: string): Promise<Requirement> => {
    const response = await api.get(`/api/v1/requirements/${id}`);
    return response.data;
  },

  // Create requirement
  create: async (data: RequirementCreate): Promise<Requirement> => {
    const response = await api.post('/api/v1/requirements', data);
    return response.data;
  },

  // Update requirement
  update: async (id: string, data: Partial<RequirementCreate>): Promise<Requirement> => {
    const response = await api.put(`/api/v1/requirements/${id}`, data);
    return response.data;
  },

  // Delete requirement
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/requirements/${id}`);
  },

  // Submit requirement for approval
  submit: async (id: string): Promise<Requirement> => {
    const response = await api.post(`/api/v1/requirements/${id}/submit`);
    return response.data;
  },

  // Approve requirement
  approve: async (id: string, comments?: string): Promise<any> => {
    const response = await api.post(`/api/v1/approvals/${id}/approve`, { comments });
    return response.data;
  },

  // Reject requirement
  reject: async (id: string, comments: string): Promise<any> => {
    const response = await api.post(`/api/v1/approvals/${id}/reject`, { comments });
    return response.data;
  },

  // Assign recruiter
  assignRecruiter: async (id: string, recruiterId: string): Promise<Requirement> => {
    const response = await api.post(`/api/v1/requirements/${id}/assign-recruiter/${recruiterId}`);
    return response.data;
  },

  // Activate requirement
  activate: async (id: string): Promise<Requirement> => {
    const response = await api.post(`/api/v1/requirements/${id}/activate`);
    return response.data;
  },

  // Get pending approvals for current user
  getPendingApprovals: async (): Promise<any[]> => {
    const response = await api.get('/api/v1/approvals/pending');
    return response.data;
  },
};
