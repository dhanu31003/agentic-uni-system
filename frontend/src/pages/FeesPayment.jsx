import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const tabs = ['All','Academic','Hostel','Mess','Misc'];

export default function FeesPayment() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('All');

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

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return <p className="text-red-500 text-center py-8">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Fees Payment System</h2>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                tab === t 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-lg font-semibold text-gray-800">
            {tab === 'All' ? 'Total Fees Outstanding:' : `${tab} Fees Total:`}{' '}
            <span className="text-blue-600 font-bold">₹{total.toLocaleString()}</span>
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                {tab === 'All' ? (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hostel</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mess</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Misc.</th>
                  </>
                ) : (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tab} Fee</th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map(f => (
                <tr key={f.studentId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{f.studentId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{f.name}</td>

                  {tab === 'All' ? (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{f.academicFee}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{f.hostelFee}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{f.messFee}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{f.miscFee}</td>
                    </>
                  ) : (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{f[{
                        Academic: 'academicFee',
                        Hostel:   'hostelFee',
                        Mess:     'messFee',
                        Misc:     'miscFee'
                      }[tab]]}
                    </td>
                  )}

                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    f.status === 'Paid'
                      ? 'text-green-600'
                      : f.status === 'Overdue'
                      ? 'text-red-600'
                      : 'text-yellow-600'
                  }`}>
                    {f.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(f.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {(f.status !== 'Paid') && (
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
      </div>
    </div>
  );
}