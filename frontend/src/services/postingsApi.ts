/**
 * Job Postings API Service
 */
import api from './api';

export interface PostingStats {
  total_posted: number;
  active: number;
  paused: number;
  closed: number;
  draft: number;
}

export interface PostingFilters {
  posting_status?: string;
  department?: string;
  channel?: string;
  search?: string;
  skip?: number;
  limit?: number;
}

export interface UpdatePostingStatusRequest {
  posting_status?: string;
  channels?: string[];
  benefits?: string[];
  custom_description?: string;
  application_instructions?: string;
}

const postingsApi = {
  /**
   * Get list of all job postings with filters
   */
  list: async (filters?: PostingFilters) => {
    const params = new URLSearchParams();
    
    if (filters?.posting_status) params.append('posting_status', filters.posting_status);
    if (filters?.department) params.append('department', filters.department);
    if (filters?.channel) params.append('channel', filters.channel);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.skip !== undefined) params.append('skip', filters.skip.toString());
    if (filters?.limit !== undefined) params.append('limit', filters.limit.toString());

    const response = await api.get(`/api/v1/postings?${params.toString()}`);
    return response.data;
  },

  /**
   * Get posting statistics
   */
  getStats: async (): Promise<PostingStats> => {
    const response = await api.get('/api/v1/postings/stats');
    return response.data;
  },

  /**
   * Update posting status (pause, reactivate, close)
   */
  updateStatus: async (requirementId: string, data: UpdatePostingStatusRequest) => {
    const response = await api.put(`/api/v1/postings/${requirementId}/status`, data);
    return response.data;
  },
};

export default postingsApi;
