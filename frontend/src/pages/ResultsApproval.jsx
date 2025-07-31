import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export default function ResultsApproval() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetch = async () => {
    try {
      const { data } = await api.get('/results/aggregate');
      setResults(data);
    } catch {
      setError('Failed to load aggregated results');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  fetch();
}, []);

  if (loading) return <p>Loading aggregated results…</p>;
  if (error)   return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl mb-4">Results Approval</h2>
      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Student ID</th>
            <th className="p-2">Subjects & Marks</th>
            <th className="p-2">Total</th>
            <th className="p-2">Average</th>
            <th className="p-2">Approved</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {results.map(r => (
            <tr key={r.studentId} className="border-t">
              <td className="p-2">{r.studentId}</td>
              <td className="p-2">
                <ul className="list-disc list-inside">
                  {r.subjects.map(s => (
                    <li key={s.subject}>
                      {s.subject}: {s.marks}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="p-2">{r.total}</td>
              <td className="p-2">{r.average.toFixed(2)}</td>
              <td className="p-2">{r.approved ? 'Yes' : 'No'}</td>
              <td className="p-2">
                {!r.approved && (
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={async () => {
                      await api.post(`/results/approve/${r.studentId}`);
                      fetch();
                    }}
                  >
                    Approve
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
