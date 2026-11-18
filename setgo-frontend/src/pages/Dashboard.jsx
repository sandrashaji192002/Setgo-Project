import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/auth/me', {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
    })
      .then(res => res.json())
      .then(data => setUser(data.user));
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-pink-300 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-xl p-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl text-gray-800">
            Welcome, <span className="font-semibold">{user?.name}</span>
          </h1>
          <button
            onClick={logout}
            className="text-xs uppercase tracking-wider text-purple-600 hover:underline"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
