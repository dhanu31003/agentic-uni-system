// frontend/src/pages/ProfessorDashboard.jsx
import React from 'react';
import { Link, useNavigate, Routes, Route } from 'react-router-dom';

import ResultsManagement from './ResultsManagement';
import CourseApprovals    from './CourseApprovals';
import ChatbotWidget from '../components/ChatbotWidget';

export default function ProfessorDashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <nav className="w-1/4 bg-gray-100 p-6">
        <h1 className="text-xl font-bold mb-4">Professor Menu</h1>
        <ul>
          <li className="mb-2">
            <Link to="results" className="text-blue-600 hover:underline">
              Result Management
            </Link>
          </li>
          <li className="mb-2">
            <Link to="course-approvals" className="text-blue-600 hover:underline">
              Registration Approvals
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
        <Routes>
          <Route index element={<h1 className="text-3xl mb-4">Welcome, Professor</h1>} />
          <Route path="results"          element={<ResultsManagement />} />
          <Route path="course-approvals" element={<CourseApprovals />} />
        </Routes>
      </main>
      <ChatbotWidget />
    </div>
  );
}
