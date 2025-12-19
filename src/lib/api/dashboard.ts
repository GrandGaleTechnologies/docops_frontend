import { useQuery } from '@tanstack/react-query';
import apiClient from './axios';
import { getErrorMessage } from './utils';

export type Period = 'day' | 'week' | 'month' | 'year';

export interface DashboardStats {
  period: string;
  last_sync_at: string;
  avg_sync_duration_ms: number;
  projects: number;
  no_of_integrations: number;
  pending_syncs: number;
  successful_syncs: number;
  failed_syncs: number;
  total_syncs: number;
}

export interface ChartDataPoint {
  label: string;
  success: number;
  failed: number;
}

export interface DashboardChartData {
  period: string;
  period_data: ChartDataPoint[];
}

// Note: These endpoints use a different response structure with "msg" instead of "status"
interface DashboardStatsResponse {
  msg: string;
  data: DashboardStats | null;
}

interface DashboardChartResponse {
  msg: string;
  data: DashboardChartData | null;
}

// Raw API functions
export const dashboardAPI = {
  /**
   * Get dashboard statistics
   */
  getStats: async (period: Period = 'day'): Promise<DashboardStats> => {
    try {
      const response = await apiClient.get<DashboardStatsResponse>(
        `/dashboard/stats?period=${period}`
      );

      // Handle the response structure (msg instead of status)
      if (response.data.msg !== 'success' || !response.data.data) {
        throw new Error('Failed to fetch dashboard stats');
      }

      return response.data.data;
    } catch (error) {
      // Use getErrorMessage to extract error message from API response
      const errorMessage = getErrorMessage(error);
      throw new Error(errorMessage);
    }
  },

  /**
   * Get dashboard chart data
   * Note: Chart endpoint only supports 'week' or 'month', so 'day' is mapped to 'week'
   */
  getChartData: async (period: Period = 'day'): Promise<DashboardChartData> => {
    try {
      // Map 'day' to 'week' since chart endpoint only supports 'week' or 'month'
      const chartPeriod = period === 'day' ? 'week' : period;
      
      const response = await apiClient.get<DashboardChartResponse>(
        `/dashboard/chart?period=${chartPeriod}`
      );

      // Handle the response structure (msg instead of status)
      if (response.data.msg !== 'success' || !response.data.data) {
        throw new Error('Failed to fetch dashboard chart data');
      }

      return response.data.data;
    } catch (error) {
      // Use getErrorMessage to extract error message from API response
      const errorMessage = getErrorMessage(error);
      throw new Error(errorMessage);
    }
  },
};

// React Query hooks
export const useDashboardStats = (period: Period = 'day') => {
  return useQuery({
    queryKey: ['dashboard', 'stats', period],
    queryFn: () => dashboardAPI.getStats(period),
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 1,
  });
};

export const useDashboardChart = (period: Period = 'day') => {
  // Map 'day' to 'week' since chart endpoint only supports 'week' or 'month'
  const chartPeriod = period === 'day' ? 'week' : period;
  
  return useQuery({
    queryKey: ['dashboard', 'chart', chartPeriod],
    queryFn: () => dashboardAPI.getChartData(period),
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 1,
  });
};
