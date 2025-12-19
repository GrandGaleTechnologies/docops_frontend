import { BrowserRouter, Routes, Route } from 'react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { queryClient } from '@/lib/queryClient';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Sync from '@/pages/Sync';
import Projects from '@/pages/Projects';
import './App.css';

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<BrowserRouter>
					<Routes>
						<Route path="/login" element={<Login />} />
						<Route path="/" element={<Dashboard />} />
						<Route path="/sync" element={<Sync />} />
						<Route path="/projects" element={<Projects />} />
					</Routes>
				</BrowserRouter>
			</AuthProvider>
		</QueryClientProvider>
	);
}

export default App;
