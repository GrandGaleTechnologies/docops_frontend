import { Badge } from '@/components/ui/badge';

export type ProjectStatus = 'active' | 'inactive' | 'pending';

/**
 * Get a status badge component for project status
 */
export function getProjectStatusBadge(status: ProjectStatus) {
  const colors: Record<ProjectStatus, string> = {
    active: 'bg-green-500/20 text-green-400 border-green-500/50',
    inactive: 'bg-slate-500/20 text-slate-300 border-slate-500/50',
    pending: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
  };

  const labels: Record<ProjectStatus, string> = {
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
  };

  return (
    <Badge variant="outline" className={`${colors[status]} py-1.5 px-4 rounded-full`}>
      {labels[status]}
    </Badge>
  );
}

