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

const chartData = [
	{ month: 'Jan', successful: 130, failed: 190 },
	{ month: 'Feb', successful: 130, failed: 90 },
	{ month: 'Mar', successful: 140, failed: 90 },
	{ month: 'Apr', successful: 190, failed: 120 },
	{ month: 'May', successful: 130, failed: 170 },
	{ month: 'Jun', successful: 120, failed: 100 },
	{ month: 'Jul', successful: 110, failed: 100 },
	{ month: 'Aug', successful: 150, failed: 120 },
	{ month: 'Sept', successful: 140, failed: 100 },
	{ month: 'Oct', successful: 130, failed: 180 },
	{ month: 'Nov', successful: 160, failed: 20 },
	{ month: 'Dec', successful: 120, failed: 180 },
];

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
					<BarChart data={chartData}>
						<CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
						<XAxis
							dataKey="month"
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
							domain={[0, 200]}
							ticks={[0, 50, 100, 150, 200]}
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
