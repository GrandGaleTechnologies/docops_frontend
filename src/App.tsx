import { BrowserRouter } from 'react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { queryClient } from '@/lib/queryClient';
import { AppRoutes } from '@/components/auth/AppRoutes';
import './App.css';

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<BrowserRouter>
					<AppRoutes />
				</BrowserRouter>
			</AuthProvider>
		</QueryClientProvider>
	);
}

export default App;
