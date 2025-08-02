import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export default function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [registrations, setRegs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const [cRes, rRes] = await Promise.all([
        api.get('/course/list'),
        api.get('/course/my')
      ]);
      setCourses(cRes.data);
      setRegs(rRes.data);
    } catch (err) {
      setError('Failed to load courses or registrations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRegister = async (code) => {
    try {
      await api.post('/course/register', { courseCode: code });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return <p className="text-red-500 text-center py-8">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Course Registration</h2>
        
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prerequisites</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seats</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map(c => {
                const reg = registrations.find(r => r.courseCode === c.code);
                return (
                  <tr key={c.code} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.credits}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {c.prerequisites.join(', ') || 'None'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`font-medium ${
                        c.enrolled >= c.maxSeats ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {c.enrolled}/{c.maxSeats}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        reg 
                          ? reg.status === 'Approved' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {reg ? reg.status : 'Not Registered'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {!reg && c.enrolled < c.maxSeats && (
                        <button
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          onClick={() => handleRegister(c.code)}
                        >
                          Register
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}