// App.js
import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './routes/Home';
import Login from './routes/Login';
import Register from './routes/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './routes/Profile';
import { getCurrentUserId } from './lib/directus';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const userId = await getCurrentUserId();
      setIsAuthenticated(userId !== undefined);
      if (!userId) {
        navigate('/login');
      }
    }
    fetchData();
  }, [navigate]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
};

export default App;