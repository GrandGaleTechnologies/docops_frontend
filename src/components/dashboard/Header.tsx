import { Link, useLocation } from 'react-router';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer';
import logo from '@/assets/logo.png';
import { cn } from '@/lib/utils';

export function Header() {
	const location = useLocation();

	const navItems = [
		{ path: '/', label: 'Dashboard' },
		{ path: '/sync', label: 'Sync' },
		{ path: '/projects', label: 'Projects' },
	];

	return (
		<header className="border-b border-border bg-card">
			<div className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<img src={logo} alt="AERIAL PROSPEX DOCK OPS" className="h-8 mr-4" />
					</div>
					<nav className="hidden items-center gap-2 md:flex">
						{navItems.map((item) => (
							<Link key={item.path} to={item.path}>
								<Button
									variant={location.pathname === item.path ? 'default' : 'ghost'}
									className={cn(
										location.pathname === item.path &&
											'bg-primary hover:bg-primary/90'
									)}
								>
									{item.label}
								</Button>
							</Link>
						))}
					</nav>
					<Drawer direction="right">
						<DrawerTrigger asChild>
							<Button variant="ghost" size="icon" className="md:hidden" aria-label="Open navigation">
								<Menu className="h-5 w-5" />
							</Button>
						</DrawerTrigger>
						<DrawerContent className="md:hidden p-4">
							<DrawerHeader className="pb-2">
								<DrawerTitle>Navigation</DrawerTitle>
							</DrawerHeader>
							<div className="grid gap-2">
								{navItems.map((item) => (
									<DrawerClose asChild key={item.path}>
										<Link to={item.path}>
											<Button
												variant={location.pathname === item.path ? 'default' : 'ghost'}
												className={cn(
													'w-full justify-start',
													location.pathname === item.path && 'bg-primary hover:bg-primary/90'
												)}
											>
												{item.label}
											</Button>
										</Link>
									</DrawerClose>
								))}
							</div>
						</DrawerContent>
					</Drawer>
				</div>
			</div>
		</header>
	);
}

