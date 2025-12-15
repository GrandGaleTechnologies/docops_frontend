import { BrowserRouter, Routes, Route } from 'react-router';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Sync from '@/pages/Sync';
import Projects from '@/pages/Projects';
import './App.css';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/" element={<Dashboard />} />
				<Route path="/sync" element={<Sync />} />
				<Route path="/projects" element={<Projects />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
