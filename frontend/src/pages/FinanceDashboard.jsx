// frontend/src/pages/FinanceDashboard.jsx

import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ChatbotWidget from '../components/ChatbotWidget';

export default function FinanceDashboard() {
  const navigate = useNavigate();
  const [overdueCount, setOverdueCount] = useState(0);

  useEffect(() => {
    api
      .get('/finance/fees')
      .then(({ data }) => setOverdueCount(data.filter(f => f.status === 'Overdue').length))
      .catch(() => {});
  }, []);

  const handleNotify = async () => {
    try {
      const { data } = await api.post('/finance/fees/notify');
      alert(`Sent ${data.count} reminders`);
    } catch (err) {
      alert(err.response?.data?.message || 'Notify failed');
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <nav className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Finance Dashboard</h1>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Overdue Fees</p>
            <p className="text-2xl font-bold text-red-600">{overdueCount}</p>
          </div>

          <button
            onClick={handleNotify}
            className="w-full mb-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-400 text-white rounded-lg font-medium hover:from-yellow-600 hover:to-yellow-500 transition-all shadow-md"
          >
            Send Due Reminders
          </button>

          <div className="space-y-2">
            <Link
              to="calendar-manage"
              className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              Manage Calendar
            </Link>
            <Link
              to="courses-manage"
              className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              Manage Courses
            </Link>
            <Link
              to="fees"
              className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              Fees Payment
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
