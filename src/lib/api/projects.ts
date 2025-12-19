import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from './axios';
import { getErrorMessage } from './utils';
import { PaginatedResponse } from './types';

export interface Project {
  id: number;
  name: string;
  description: string;
  user_id: number;
  auto_sync: boolean | null;
  file_count: number;
  status: 'active' | 'inactive' | 'pending';
  s3_prefix: string;
  s3_bucket: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectsQueryParams {
  query?: string;
  auto_sync?: boolean;
  page?: number;
  size?: number;
  order_by?: 'asc' | 'desc';
}

export interface CreateProjectData {
  name: string;
  description?: string;
  auto_sync: boolean;
  s3_bucket: string;
  s3_prefix: string;
}

export interface UpdateProjectData {
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'pending';
  s3_bucket: string;
  s3_prefix: string;
  file_count: number;
  auto_sync: boolean;
}

// Response structure for single project
interface ProjectResponse {
  msg: string;
  data: Project;
}

// Raw API function
export const projectsAPI = {
  /**
   * Get projects with pagination and filters
   */
  getProjects: async (params: ProjectsQueryParams = {}): Promise<PaginatedResponse<Project>> => {
    try {
      const searchParams = new URLSearchParams();

      if (params.query) searchParams.append('query', params.query);
      if (params.auto_sync !== undefined) searchParams.append('auto_sync', String(params.auto_sync));
      if (params.page !== undefined) searchParams.append('page', String(params.page));
      if (params.size !== undefined) searchParams.append('size', String(params.size));
      if (params.order_by) searchParams.append('order_by', params.order_by);

      const response = await apiClient.get<PaginatedResponse<Project>>(
        `/projects?${searchParams.toString()}`
      );

      return response.data;
    } catch (error) {
      // Use getErrorMessage to extract error message from API response
      const errorMessage = getErrorMessage(error);
      throw new Error(errorMessage);
    }
  },

  /**
   * Get a single project by ID
   */
  getProject: async (projectId: string | number): Promise<Project> => {
    try {
      const response = await apiClient.get<ProjectResponse>(`/projects/${projectId}`);

      return response.data.data;
    } catch (error) {
      // Use getErrorMessage to extract error message from API response
      const errorMessage = getErrorMessage(error);
      throw new Error(errorMessage);
    }
  },

  /**
   * Create a new project
   */
  createProject: async (data: CreateProjectData): Promise<Project> => {
    try {
      const response = await apiClient.post<ProjectResponse>('/projects', data);

      return response.data.data;
    } catch (error) {
      // Use getErrorMessage to extract error message from API response
      const errorMessage = getErrorMessage(error);
      throw new Error(errorMessage);
    }
  },

  /**
   * Update project status
   */
  updateProjectStatus: async (projectId: string | number, status: 'active' | 'inactive'): Promise<Project> => {
    try {
      const response = await apiClient.get<ProjectResponse>(
        `/projects/${projectId}/status?status=${status}`
      );

      // Handle the response structure (msg instead of status)
      if (response.data.msg !== 'success' || !response.data.data) {
        throw new Error('Failed to update project status');
      }

      return response.data.data;
    } catch (error) {
      // Use getErrorMessage to extract error message from API response
      const errorMessage = getErrorMessage(error);
      throw new Error(errorMessage);
    }
  },

  /**
   * Update a project
   */
  updateProject: async (projectId: string | number, data: UpdateProjectData): Promise<Project> => {
    try {
      const response = await apiClient.put<ProjectResponse>(`/projects/${projectId}`, data);
      return response.data.data;
    } catch (error) {
      // Use getErrorMessage to extract error message from API response
      const errorMessage = getErrorMessage(error);
      throw new Error(errorMessage);
    }
  },

  /**
   * Delete a project
   */
  deleteProject: async (projectId: string | number): Promise<void> => {
    try {
      await apiClient.delete(`/projects/${projectId}`);
    } catch (error) {
      // Use getErrorMessage to extract error message from API response
      const errorMessage = getErrorMessage(error);
      throw new Error(errorMessage);
    }
  },
};

// React Query hooks
export const useProjects = (params: ProjectsQueryParams = {}) => {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: () => projectsAPI.getProjects(params),
    staleTime: 30 * 1000, // 30 seconds
    retry: 1,
  });
};

export const useProject = (projectId: string | number | null, enabled = true) => {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectsAPI.getProject(projectId!),
    enabled: enabled && projectId !== null,
    staleTime: 30 * 1000, // 30 seconds
    retry: 1,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectData) => projectsAPI.createProject(data),
    onSuccess: () => {
      // Invalidate and refetch projects list
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error) => {
      console.error('Create project failed:', getErrorMessage(error));
    },
  });
};

export const useUpdateProjectStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, status }: { projectId: string | number; status: 'active' | 'inactive' }) =>
      projectsAPI.updateProjectStatus(projectId, status),
    onSuccess: (_data, variables) => {
      // Invalidate and refetch projects list
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      // Also invalidate the specific project query if it exists
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
    },
    onError: (error) => {
      console.error('Update project status failed:', getErrorMessage(error));
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string | number; data: UpdateProjectData }) =>
      projectsAPI.updateProject(projectId, data),
    onSuccess: (_data, variables) => {
      // Invalidate and refetch projects list
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      // Also invalidate the specific project query if it exists
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
    },
    onError: (error) => {
      console.error('Update project failed:', getErrorMessage(error));
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string | number) => projectsAPI.deleteProject(projectId),
    onSuccess: () => {
      // Invalidate and refetch projects list
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error) => {
      console.error('Delete project failed:', getErrorMessage(error));
    },
  });
};

