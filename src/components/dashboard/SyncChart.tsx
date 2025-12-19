import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateFilter } from '@/components/dashboard/DateFilter';
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	ChartLegend,
	ChartLegendContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { useDashboardChart, Period } from '@/lib/api/dashboard';
import { useMemo } from 'react';

const chartConfig = {
	successful: {
		label: 'Successful',
		color: 'hsl(173, 80%, 40%)',
	},
	failed: {
		label: 'Failed',
		color: 'hsl(0, 84%, 60%)',
	},
};

type SyncChartProps = {
	period: 'month' | 'week' | 'day';
	onPeriodChange: (value: 'month' | 'week' | 'day') => void;
};

export function SyncChart({ period, onPeriodChange }: SyncChartProps) {
	const { data: chartData, isLoading, error } = useDashboardChart(period as Period);

	// Transform API data to chart format
	const transformedData = useMemo(() => {
		if (!chartData?.period_data) return [];

		return chartData.period_data.map((item) => ({
			label: item.label,
			successful: item.success,
			failed: item.failed,
		}));
	}, [chartData]);

	// Calculate max value for Y-axis domain
	const maxValue = useMemo(() => {
		if (transformedData.length === 0) return 200;
		const max = Math.max(
			...transformedData.map((d) => Math.max(d.successful, d.failed))
		);
		// Round up to nearest 50 for cleaner Y-axis
		return Math.ceil(max / 50) * 50 || 200;
	}, [transformedData]);

	// Generate Y-axis ticks based on max value
	const yAxisTicks = useMemo(() => {
		const ticks: number[] = [];
		const step = Math.ceil(maxValue / 4);
		for (let i = 0; i <= maxValue; i += step) {
			ticks.push(i);
		}
		return ticks.length > 0 ? ticks : [0, 50, 100, 150, 200];
	}, [maxValue]);

	if (isLoading) {
		return (
			<Card className="bg-card rounded-2xl border border-border">
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>Successful vs Failed Syncs (Bar Chart)</CardTitle>
						<DateFilter value={period} onChange={onPeriodChange} />
					</div>
				</CardHeader>
				<CardContent>
					<div className="h-[400px] flex items-center justify-center text-muted-foreground">
						Loading chart data...
					</div>
				</CardContent>
			</Card>
		);
	}

	if (error || !chartData || transformedData.length === 0) {
		return (
			<Card className="bg-card rounded-2xl border border-border">
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>Successful vs Failed Syncs (Bar Chart)</CardTitle>
						<DateFilter value={period} onChange={onPeriodChange} />
					</div>
				</CardHeader>
				<CardContent>
					<div className="h-[400px] flex items-center justify-center text-red-400">
						Failed to load chart data. Please try again.
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="bg-card rounded-2xl border border-border">
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle>Successful vs Failed Syncs (Bar Chart)</CardTitle>
					<DateFilter value={period} onChange={onPeriodChange} />
				</div>
			</CardHeader>

			<CardContent>
				<ChartContainer config={chartConfig} className="h-[400px] text-white w-full border border-border rounded-2xl p-4">
					<BarChart data={transformedData}>
						<CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
						<XAxis
							dataKey="label"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							className="text-xs text-white"
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							className="text-xs text-white"
							domain={[0, maxValue]}
							ticks={yAxisTicks}
						/>
						<ChartTooltip content={<ChartTooltipContent />} />
						<ChartLegend content={<ChartLegendContent payload={undefined} />} />
						<Bar
							dataKey="successful"
							className="text-white"
							fill="var(--color-successful)"
							radius={[4, 4, 0, 0]}
						/>
						<Bar
							dataKey="failed"
							className="text-white"
							fill="var(--color-failed)"
							radius={[4, 4, 0, 0]}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
