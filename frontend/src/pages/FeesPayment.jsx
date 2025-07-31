import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const tabs = ['All','Academic','Hostel','Mess','Misc'];

export default function FeesPayment() {
  const [fees, setFees]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [tab, setTab]         = useState('All');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/finance/fees');
        setFees(data);
      } catch (err) {
        setError('Failed to load fees');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = fees.filter(f => {
    if (tab === 'All') return true;
    const field = {
      Academic: 'academicFee',
      Hostel:   'hostelFee',
      Mess:     'messFee',
      Misc:     'miscFee',
    }[tab];
    return f[field] > 0;
  });

  const total = filtered.reduce((sum, f) => {
    if (tab === 'All') {
      return sum + f.academicFee + f.hostelFee + f.messFee + f.miscFee;
    }
    const fieldMap = {
      Academic: 'academicFee',
      Hostel:   'hostelFee',
      Mess:     'messFee',
      Misc:     'miscFee',
    };
    return sum + f[fieldMap[tab]];
  }, 0);

  if (loading) return <p>Loading fee data…</p>;
  if (error)   return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl mb-4">Fees Payment System</h2>

      {/* Tabs */}
      <div className="flex mb-4 space-x-2">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded ${
              tab === t ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Summary */}
      <p className="mb-4 font-semibold">
        {tab === 'All' ? 'Total Fees Outstanding:' : `${tab} Fees Total:`}{' '}
        <span className="text-blue-600">₹{total}</span>
      </p>

      {/* Table */}
      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">ID</th>
            <th className="p-2">Name</th>
            {tab === 'All' && <>
              <th className="p-2">Academic</th>
              <th className="p-2">Hostel</th>
              <th className="p-2">Mess</th>
              <th className="p-2">Misc.</th>
            </>}
            {tab !== 'All' && <th className="p-2">{tab} Fee</th>}
            <th className="p-2">Status</th>
            <th className="p-2">Due Date</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(f => (
            <tr key={f.studentId} className="border-t">
              <td className="p-2">{f.studentId}</td>
              <td className="p-2">{f.name}</td>

              {tab === 'All' ? (
                <>
                  <td className="p-2">₹{f.academicFee}</td>
                  <td className="p-2">₹{f.hostelFee}</td>
                  <td className="p-2">₹{f.messFee}</td>
                  <td className="p-2">₹{f.miscFee}</td>
                </>
              ) : (
                <td className="p-2">
                  ₹{f[{
                    Academic: 'academicFee',
                    Hostel:   'hostelFee',
                    Mess:     'messFee',
                    Misc:     'miscFee'
                  }[tab]]}
                </td>
              )}

              <td className={`p-2 font-medium ${
                f.status === 'Paid'
                  ? 'text-green-600'
                  : f.status === 'Overdue'
                  ? 'text-red-600'
                  : 'text-yellow-600'
              }`}>
                {f.status}
              </td>
              <td className="p-2">{new Date(f.dueDate).toLocaleDateString()}</td>
              <td className="p-2">
                {(f.status !== 'Paid') && (
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={async () => {
                      await api.post(`/finance/fees/${f.studentId}/mark-paid`);
                      const { data } = await api.get('/finance/fees');
                      setFees(data);
                    }}
                  >
                    Mark Paid
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
