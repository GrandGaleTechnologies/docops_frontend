import { Header } from '@/components/dashboard/Header';
import { MasterAutoSyncControl } from '@/components/dashboard/MasterAutoSyncControl';
import { SyncProjectActivityTable } from '@/components/dashboard/SyncProjectActivityTable';

const Sync = () => {
	return (
		<div className="min-h-screen bg-background">
			<Header />
			<div className="container mx-auto px-4 py-8 space-y-8">
				<MasterAutoSyncControl />
				<SyncProjectActivityTable />
			</div>
		</div>
	);
};

export default Sync;

