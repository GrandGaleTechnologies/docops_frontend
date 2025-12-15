import { Card, CardContent } from '@/components/ui/card';
import { DateFilter } from '@/components/dashboard/DateFilter';
import { RefreshCw, Folder, Link2, XCircle, CheckCircle2, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
	icon: React.ReactNode;
	label: string;
	value: string;
	className?: string;
}

function StatCard({ icon, label, value, className }: StatCardProps) {
	return (
		<Card className={cn('rounded-none border-none bg-transparent', className)}>
			<CardContent className="relative p-6">
				<div className="flex items-center gap-4">
					<div className="text-muted-foreground">{icon}</div>
					<div className="flex-1">
						<p className="text-sm text-muted-foreground mb-1">{label}</p>
						<p className="text-2xl font-semibold text-foreground">{value}</p>
					</div>
				</div>
				<div className="absolute right-0 top-4 bottom-4 w-px bg-border/25" />
			</CardContent>
		</Card>
	);
}

type SummaryStatsProps = {
	period: 'month' | 'week' | 'day';
	onPeriodChange: (value: 'month' | 'week' | 'day') => void;
};

export function SummaryStats({ period, onPeriodChange }: SummaryStatsProps) {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-4xl font-bold text-white">Welcome Back, Anthony</h1>
				<DateFilter value={period} onChange={onPeriodChange} />
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-card rounded-2xl p-4 border border-border">
				<StatCard
					icon={<RefreshCw className="h-6 w-6" />}
					label="Last Sync at"
					value="11/12/25/1:00pm"
				/>
				<StatCard
					icon={<RefreshCw className="h-6 w-6" />}
					label="Avg. Sync at"
					value="2.3 secs"
				/>
				<StatCard
					icon={<RefreshCw className="h-6 w-6" />}
					label="No. of Syncs"
					value="200"
				/>
				<StatCard
					icon={<Folder className="h-6 w-6" />}
					label="No. of Projects"
					value="200"
				/>
				<StatCard
					icon={<Link2 className="h-6 w-6" />}
					label="No. of Integrations"
					value="6"
				/>
				<StatCard
					icon={<ArrowUp className="h-6 w-6" />}
					label="Pending Syncs"
					value="400"
				/>
				<StatCard
					icon={<XCircle className="h-6 w-6" />}
					label="Failed Syncs"
					value="259"
				/>
				<StatCard
					icon={<CheckCircle2 className="h-6 w-6" />}
					label="Successful Syncs"
					value="200"
				/>
			</div>
		</div>
	);
}

