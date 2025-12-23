import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from './axios';
import { getErrorMessage } from './utils';

export interface IntegrationConfig {
  acc_project_id?: string;
  acc_folder_id?: string;
  s3_bucket?: string;
  s3_prefix?: string;
  [key: string]: unknown; // Allow other config fields
}

export interface Integration {
  id: number;
  project_id: number;
  integration_type: string;
  enabled: boolean;
  config: IntegrationConfig;
  created_at: string;
  updated_at: string | null;
}

export type IntegrationType = 'acc' | 'drone_deploy';

interface IntegrationsResponse {
  msg: string;
  data: Integration[];
}

interface IntegrationResponse {
  msg: string;
  data: Integration;
}

// Raw API function
export const integrationsAPI = {
  /**
   * Get integrations for a project
   */
  getProjectIntegrations: async (projectId: string | number): Promise<Integration[]> => {
    try {
      const response = await apiClient.get<IntegrationsResponse>(
        `/integrations/project/${projectId}`
      );

      return response.data.data;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      throw new Error(errorMessage);
    }
  },

  /**
   * Create a new integration for a project
   */
  createProjectIntegration: async (
    projectId: string | number,
    integrationType: IntegrationType
  ): Promise<Integration> => {
    try {
      const response = await apiClient.post<IntegrationResponse>(
        `/integrations/project/${projectId}/integrate?integration=${integrationType}`,
        {}
      );

      return response.data.data;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      throw new Error(errorMessage);
    }
  },

  /**
   * Delete an integration
   */
  deleteIntegration: async (integrationId: string | number): Promise<void> => {
    try {
      await apiClient.delete(`/integrations/${integrationId}`);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      throw new Error(errorMessage);
    }
  },
};

// React Query hook
export const useProjectIntegrations = (projectId: string | number | null, enabled = true) => {
  return useQuery({
    queryKey: ['project-integrations', projectId],
    queryFn: () => integrationsAPI.getProjectIntegrations(projectId!),
    enabled: enabled && projectId !== null,
    staleTime: 30 * 1000, // 30 seconds
    retry: 1,
  });
};

// React Query mutation hook
export const useCreateProjectIntegration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      integrationType,
    }: {
      projectId: string | number;
      integrationType: IntegrationType;
    }) => integrationsAPI.createProjectIntegration(projectId, integrationType),
    onSuccess: (_data, variables) => {
      // Invalidate and refetch integrations list for this project
      queryClient.invalidateQueries({ queryKey: ['project-integrations', variables.projectId] });
    },
    onError: (error) => {
      console.error('Create integration failed:', getErrorMessage(error));
    },
  });
};

// React Query mutation hook for deleting integration
export const useDeleteIntegration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      integrationId,
      projectId: _projectId,
    }: {
      integrationId: string | number;
      projectId: string | number;
    }) => integrationsAPI.deleteIntegration(integrationId),
    onSuccess: (_data, variables) => {
      // Invalidate and refetch integrations list for this project
      queryClient.invalidateQueries({ queryKey: ['project-integrations', variables.projectId] });
    },
    onError: (error) => {
      console.error('Delete integration failed:', getErrorMessage(error));
    },
  });
};

