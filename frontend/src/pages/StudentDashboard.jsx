// frontend/src/pages/StudentDashboard.jsx

import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import ChatbotWidget from '../components/ChatbotWidget';

export default function StudentDashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <nav className="w-1/4 bg-gray-100 p-6">
        <h1 className="text-xl font-bold mb-4">Student Menu</h1>
        <ul>
          <li className="mb-2">
            <Link to="courses" className="text-blue-600 hover:underline">
              Course Registration
            </Link>
          </li>
          <li className="mb-2">
            <Link to="fees" className="text-blue-600 hover:underline">
              My Fee History
            </Link>
          </li>
          <li className="mb-2">
            <Link to="results" className="text-blue-600 hover:underline">
              My Exam Results
            </Link>
          </li>
          <li className="mb-2">
            <Link to="calendar" className="text-blue-600 hover:underline">
              Academic Calendar
            </Link>
          </li>
        </ul>
        <button
          onClick={logout}
          className="mt-6 px-4 py-2 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>

      <ChatbotWidget />
    </div>
  );
}
