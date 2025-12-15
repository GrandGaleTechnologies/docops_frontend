import { Header } from '@/components/dashboard/Header';
import { ProjectsTable } from '@/components/dashboard/ProjectsTable';

const Projects = () => {
	return (
		<div className="min-h-screen bg-background">
			<Header />
			<div className="container mx-auto px-4 py-8 space-y-8">
				<ProjectsTable />
			</div>
		</div>
	);
};

export default Projects;
