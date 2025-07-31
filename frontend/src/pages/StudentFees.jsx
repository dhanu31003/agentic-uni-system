import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function StudentFees() {
  const [fees, setFees]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/student/fees');
        setFees(data);
      } catch (err) {
        setError('Failed to load your fees');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Loading your fee history…</p>;
  if (error)   return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl mb-4">My Fee History</h2>
      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Academic</th>
            <th className="p-2">Hostel</th>
            <th className="p-2">Mess</th>
            <th className="p-2">Misc.</th>
            <th className="p-2">Status</th>
            <th className="p-2">Due Date</th>
          </tr>
        </thead>
        <tbody>
          {fees.map(f => (
            <tr key={f._id} className="border-t">
              <td className="p-2">₹{f.academicFee}</td>
              <td className="p-2">₹{f.hostelFee}</td>
              <td className="p-2">₹{f.messFee}</td>
              <td className="p-2">₹{f.miscFee}</td>
              <td className={`p-2 font-medium ${
                f.status === 'Paid'
                  ? 'text-green-600'
                  : f.status === 'Overdue'
                  ? 'text-red-600'
                  : 'text-yellow-600'
              }`}>{f.status}</td>
              <td className="p-2">{new Date(f.dueDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
