import { useState } from 'react';
import { Header } from '@/components/dashboard/Header';
import { SummaryStats } from '@/components/dashboard/SummaryStats';
import { SyncChart } from '@/components/dashboard/SyncChart';
import { ProjectsTable } from '@/components/dashboard/ProjectsTable';

const Dashboard = () => {
	const [period, setPeriod] = useState<'month' | 'week' | 'day'>('month');

	return (
		<div className="min-h-screen bg-background">
			<Header />
			<div className="container mx-auto px-4 py-8 space-y-8">
				<SummaryStats period={period} onPeriodChange={setPeriod} />
				<SyncChart period={period} onPeriodChange={setPeriod} />
				<ProjectsTable />
			</div>
		</div>
	);
};

export default Dashboard;

