// frontend/src/pages/VCDashboard.jsx
import React from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import ResultsApproval from './ResultsApproval';
import ChatbotWidget from '../components/ChatbotWidget';

export default function VCDashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <nav className="w-1/4 bg-gray-100 p-6">
        <h1 className="text-xl font-bold mb-4">HoD/VC Menu</h1>
        <ul>
          <li className="mb-2">
            <Link to="results-approve" className="text-blue-600 hover:underline">
              Results Approval
            </Link>
          </li>
          {/* add more HoD/VC links here as needed */}
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
          <Route
            index
            element={<h1 className="text-3xl mb-4">Welcome, HoD/VC</h1>}
          />
          <Route path="results-approve" element={<ResultsApproval />} />
        </Routes>
      </main>
      <ChatbotWidget />
    </div>
  );
}
