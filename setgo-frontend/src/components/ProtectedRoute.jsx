import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return setStatus('no');

    fetch('http://localhost:5000/api/auth/me', {
      headers: { Authorization: 'Bearer ' + token },
    })
      .then(res => {
        if (!res.ok) throw new Error();
        setStatus('yes');
      })
      .catch(() => {
        localStorage.removeItem('token');
        setStatus('no');
      });
  }, []);

  if (status === 'checking') return <p className="p-6">Loading...</p>;
  if (status === 'no') return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
