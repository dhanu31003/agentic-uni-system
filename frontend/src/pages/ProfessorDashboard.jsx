import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import ChatbotWidget from '../components/ChatbotWidget';

export default function ProfessorDashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <nav className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Professor Dashboard</h1>

          <div className="space-y-2">
            <Link 
              to="results" 
              className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              Result Management
            </Link>
            <Link 
              to="course-approvals" 
              className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              Registration Approvals
            </Link>
            <Link 
              to="calendar" 
              className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              Academic Calendar
            </Link>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      <ChatbotWidget />
    </div>
  );
}