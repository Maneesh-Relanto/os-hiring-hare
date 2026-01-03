import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';

function App() {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Routes>
        <Route path="/" element={<div>Welcome to Hiring Hare</div>} />
        {/* More routes will be added */}
      </Routes>
    </Box>
  );
}

export default App;
