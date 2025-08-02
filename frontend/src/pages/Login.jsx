import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { jwtDecode } from 'jwt-decode';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const { token } = data;
      const { role } = jwtDecode(token);

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      switch (role) {
        case 'Student':
          navigate('/dashboard/student');
          break;
        case 'Professor':
          navigate('/dashboard/professor');
          break;
        case 'Finance':
          navigate('/dashboard/finance');
          break;
        case 'VC':
          navigate('/dashboard/vc');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white text-center">
            <h1 className="text-3xl font-bold">University Portal</h1>
            <p className="mt-2 opacity-90">Sign in to your account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="your@email.com"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="••••••••"
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md"
            >
              Sign In
            </button>
            
            <div className="mt-6 text-center">
              <Link 
                to="/register" 
                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
              >
                Don't have an account? Register now
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}