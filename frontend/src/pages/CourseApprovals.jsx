import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export default function CourseApprovals() {
  const [regs, setRegs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  const fetchPending = async () => {
    try {
      const { data } = await api.get('/course/pending');
      setRegs(data);
    } catch (err) {
      setError('Failed to load pending registrations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const decide = async (id, approve) => {
    try {
      await api.post(`/course/decide/${id}`, { approve });
      fetchPending();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  if (loading) return <p>Loading pending registrations…</p>;
  if (error)   return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl mb-4">Registration Approvals</h2>
      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Student ID</th>
            <th className="p-2">Course</th>
            <th className="p-2">Requested At</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {regs.map(r => (
            <tr key={r._id} className="border-t">
              <td className="p-2">{r.studentId}</td>
              <td className="p-2">{r.courseCode}</td>
              <td className="p-2">{new Date(r.requestedAt).toLocaleString()}</td>
              <td className="p-2 space-x-2">
                <button
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={() => decide(r._id, true)}
                >
                  Approve
                </button>
                <button
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={() => decide(r._id, false)}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
          {regs.length === 0 && (
            <tr><td colSpan={4} className="p-4 text-center">No pending requests</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
