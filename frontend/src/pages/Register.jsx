import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/register', { name, email, password, role, studentId });
      setSuccess('Registration successful! Redirecting to login…');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-500 p-6 text-white text-center">
            <h1 className="text-3xl font-bold">Create Account</h1>
            <p className="mt-2 opacity-90">Join our university community</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                {success}
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                placeholder="John Doe"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                placeholder="your@email.com"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                placeholder="••••••••"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white"
              >
                <option value="Student">Student</option>
                <option value="Professor">Professor</option>
                <option value="Finance">Finance</option>
                <option value="VC">VC</option>
              </select>
            </div>
            
            {role === 'Student' && (
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">Student ID</label>
                <input
                  type="text"
                  value={studentId}
                  onChange={e => setStudentId(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  placeholder="S12345678"
                />
              </div>
            )}
            
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-600 transition-all shadow-md disabled:opacity-50"
              disabled={!!success}
            >
              Register
            </button>
            
            <div className="mt-6 text-center">
              <Link 
                to="/" 
                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}