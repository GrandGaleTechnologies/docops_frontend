import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

type PeriodValue = 'month' | 'week' | 'day';

type DateFilterProps = {
	value: PeriodValue;
	onChange: (value: PeriodValue) => void;
	className?: string;
};

export function DateFilter({ value, onChange, className }: DateFilterProps) {
	return (
		<Select value={value} onValueChange={(val) => onChange(val as PeriodValue)}>
			<SelectTrigger className={cn('w-[140px] bg-card rounded-full border border-border', className)}>
				<SelectValue placeholder="By Month" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="month">By Month</SelectItem>
				<SelectItem value="week">By Week</SelectItem>
				<SelectItem value="day">By Day</SelectItem>
			</SelectContent>
		</Select>
	);
}

