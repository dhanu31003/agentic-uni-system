// frontend/src/pages/FinanceDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ChatbotWidget from '../components/ChatbotWidget';

export default function FinanceDashboard() {
  const navigate = useNavigate();
  const [overdueCount, setOverdueCount] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/finance/fees');
        setOverdueCount(data.filter(f => f.status === 'Overdue').length);
      } catch {
        // ignore
      }
    })();
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
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <nav className="w-1/4 bg-gray-100 p-6">
        <h1 className="text-xl font-bold mb-4">Finance Menu</h1>

        <p className="mb-4">
          Overdue Fees: <span className="font-bold text-red-600">{overdueCount}</span>
        </p>
        <button
          onClick={handleNotify}
          className="mb-4 w-full py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Send Due Reminders
        </button>

        <ul>
          <li className="mb-2">
            <Link to="courses-manage" className="text-blue-600 hover:underline">
              Manage Courses
            </Link>
          </li>
          <li className="mb-2">
            <Link to="fees" className="text-blue-600 hover:underline">
              Fees Payment
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

      {/* Main Content via nested routes */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
      <ChatbotWidget />
    </div>
  );
}
