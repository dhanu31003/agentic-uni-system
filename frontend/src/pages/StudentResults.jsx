import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function StudentResults() {
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/student/results');
        setResult(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load results');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Loading your results…</p>;
  if (error)   return <p className="text-red-500">{error}</p>;

  const { subjects, total, average } = result;

  return (
    <div>
      <h2 className="text-2xl mb-4">My Exam Results</h2>
      <table className="min-w-full bg-white shadow rounded mb-4">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Subject</th>
            <th className="p-2">Marks</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map(s => (
            <tr key={s.subject} className="border-t">
              <td className="p-2">{s.subject}</td>
              <td className="p-2">{s.marks}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="font-semibold">Total: {total}</p>
      <p className="font-semibold">Average: {average.toFixed(2)}</p>
    </div>
  );
}
