import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Requirements from './pages/Requirements';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/requirements" element={<Requirements />} />
        <Route path="/candidates" element={<div>Candidates Page (Coming Soon)</div>} />
        <Route path="/reports" element={<div>Reports Page (Coming Soon)</div>} />
        <Route path="/settings" element={<div>Settings Page (Coming Soon)</div>} />
      </Routes>
    </Layout>
  );
}

export default App;
