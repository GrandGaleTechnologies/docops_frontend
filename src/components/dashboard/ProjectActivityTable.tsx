import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectActivity {
	timestamp: string;
	integration: string;
	project: string;
	fileCount: string;
	status: 'Success' | 'Failed' | 'In-Progress';
	type: string;
	duration: string;
}

const mockData: ProjectActivity[] = [
	{
		timestamp: '18/9/25 1:00pm',
		integration: 'ACC',
		project: 'Project A',
		fileCount: '200',
		status: 'Success',
		type: 'Lorem',
		duration: '2.4 secs',
	},
	{
		timestamp: '18/9/25 1:00pm',
		integration: 'DroneDeploy',
		project: 'Project C',
		fileCount: '200',
		status: 'Failed',
		type: 'Lorem',
		duration: '2.4 secs',
	},
	{
		timestamp: '18/9/25 1:00pm',
		integration: 'ACC',
		project: 'Project B',
		fileCount: '200',
		status: 'In-Progress',
		type: 'Lorem',
		duration: '2.4 secs',
	},
	{
		timestamp: '18/9/25 1:00pm',
		integration: 'ACC',
		project: 'Project A',
		fileCount: '200',
		status: 'Success',
		type: 'Lorem',
		duration: '2.4 secs',
	},
	{
		timestamp: '18/9/25 1:00pm',
		integration: 'ACC',
		project: 'Project A',
		fileCount: '200',
		status: 'Success',
		type: 'Lorem',
		duration: '2.4 secs',
	},
	{
		timestamp: '18/9/25 1:00pm',
		integration: 'DroneDeploy',
		project: 'Project B',
		fileCount: '200',
		status: 'In-Progress',
		type: 'Lorem',
		duration: '2.4 secs',
	},
];

const getStatusBadge = (status: ProjectActivity['status']) => {
	const variants = {
		Success: 'default',
		Failed: 'destructive',
		'In-Progress': 'secondary',
	} as const;

	const colors = {
		Success: 'bg-green-500/20 text-green-400 border-green-500/50',
		Failed: 'bg-red-500/20 text-red-400 border-red-500/50',
		'In-Progress': 'bg-blue-500/20 text-blue-400 border-blue-500/50',
	};

	return (
		<Badge
			variant={variants[status]}
			className={colors[status]}
		>
			{status}
		</Badge>
	);
};

export function ProjectActivityTable() {
	const [currentPage, setCurrentPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState('');
	const itemsPerPage = 6;

	const filteredData = mockData.filter((item) =>
		item.project.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const totalPages = Math.ceil(filteredData.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Project Activity</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex items-center justify-between gap-4">
					<div className="relative flex-1 max-w-sm">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
						<Input
							placeholder="Search by Project Name"
							value={searchQuery}
							onChange={(e) => {
								setSearchQuery(e.target.value);
								setCurrentPage(1);
							}}
							className="pl-10"
						/>
					</div>

					<div className="flex w-1/4 justify-end">
						<Select>
							<SelectTrigger className="w-[120px]">
								<SelectValue placeholder="Filter" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All</SelectItem>
								<SelectItem value="success">Success</SelectItem>
								<SelectItem value="failed">Failed</SelectItem>
								<SelectItem value="in-progress">In-Progress</SelectItem>
							</SelectContent>
						</Select>

						<Select>
							<SelectTrigger className="w-[120px]">
								<SelectValue placeholder="Sort" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="newest">Newest</SelectItem>
								<SelectItem value="oldest">Oldest</SelectItem>
								<SelectItem value="name">Name</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Timestamp</TableHead>
								<TableHead>Integration</TableHead>
								<TableHead>Project</TableHead>
								<TableHead>File Count</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Type</TableHead>
								<TableHead>Duration</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{paginatedData.map((row, index) => (
								<TableRow key={index}>
									<TableCell>{row.timestamp}</TableCell>
									<TableCell>{row.integration}</TableCell>
									<TableCell>{row.project}</TableCell>
									<TableCell>{row.fileCount}</TableCell>
									<TableCell>{getStatusBadge(row.status)}</TableCell>
									<TableCell>{row.type}</TableCell>
									<TableCell>{row.duration}</TableCell>
									<TableCell>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon">
													<MoreVertical className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem>View Details</DropdownMenuItem>
												<DropdownMenuItem>Retry Sync</DropdownMenuItem>
												<DropdownMenuItem>Delete</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>

				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								href="#"
								onClick={(e) => {
									e.preventDefault();
									if (currentPage > 1) setCurrentPage(currentPage - 1);
								}}
								className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
							/>
						</PaginationItem>
						{Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
							const page = i + 1;
							if (totalPages > 10) {
								if (page === 1 || page === totalPages) {
									return (
										<PaginationItem key={page}>
											<PaginationLink
												href="#"
												onClick={(e) => {
													e.preventDefault();
													setCurrentPage(page);
												}}
												isActive={currentPage === page}
											>
												{page}
											</PaginationLink>
										</PaginationItem>
									);
								}
								if (page === currentPage || page === currentPage - 1 || page === currentPage + 1) {
									return (
										<PaginationItem key={page}>
											<PaginationLink
												href="#"
												onClick={(e) => {
													e.preventDefault();
													setCurrentPage(page);
												}}
												isActive={currentPage === page}
											>
												{page}
											</PaginationLink>
										</PaginationItem>
									);
								}
								if (page === 2 || page === totalPages - 1) {
									return (
										<PaginationItem key={page}>
											<PaginationEllipsis />
										</PaginationItem>
									);
								}
								return null;
							}
							return (
								<PaginationItem key={page}>
									<PaginationLink
										href="#"
										onClick={(e) => {
											e.preventDefault();
											setCurrentPage(page);
										}}
										isActive={currentPage === page}
									>
										{page}
									</PaginationLink>
								</PaginationItem>
							);
						})}
						<PaginationItem>
							<PaginationNext
								href="#"
								onClick={(e) => {
									e.preventDefault();
									if (currentPage < totalPages) setCurrentPage(currentPage + 1);
								}}
								className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</CardContent>
		</Card>
	);
}

