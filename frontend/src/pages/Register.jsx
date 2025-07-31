// frontend/src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

export default function Register() {
  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [role, setRole]           = useState('Student');
  const [studentId, setStudentId] = useState('');
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl mb-6 text-center">Register an Account</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <label className="block mb-2">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="w-full p-2 border rounded mb-4"
        />

        <label className="block mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded mb-4"
        />

        <label className="block mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded mb-4"
        />

        <label className="block mb-2">Role</label>
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          className="w-full p-2 border rounded mb-6"
        >
          <option value="Student">Student</option>
          <option value="Professor">Professor</option>
          <option value="Finance">Finance</option>
          <option value="VC">VC</option>
        </select>

        {role === 'Student' && (
          <>
            <label className="block mb-2">Student ID</label>
            <input
              type="text"
              value={studentId}
              onChange={e => setStudentId(e.target.value)}
              required
              className="w-full p-2 border rounded mb-4"
            />
          </>
        )}

        <button
          type="submit"
          className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
          disabled={!!success}
        >
          Register
        </button>

        <p className="mt-4 text-center">
          Already have an account?{' '}
          <Link to="/" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
);
}
