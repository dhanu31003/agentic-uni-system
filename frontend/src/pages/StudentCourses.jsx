import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export default function StudentCourses() {
  const [courses, setCourses]       = useState([]);
  const [registrations, setRegs]    = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');

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

  if (loading) return <p>Loading courses…</p>;
  if (error)   return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl mb-4">Course Registration</h2>
      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Code</th>
            <th className="p-2">Name</th>
            <th className="p-2">Credits</th>
            <th className="p-2">Prerequisites</th>
            <th className="p-2">Seats</th>
            <th className="p-2">Status</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(c => {
            const reg = registrations.find(r => r.courseCode === c.code);
            return (
              <tr key={c.code} className="border-t">
                <td className="p-2">{c.code}</td>
                <td className="p-2">{c.name}</td>
                <td className="p-2">{c.credits}</td>
                <td className="p-2">{c.prerequisites.join(', ') || 'None'}</td>
                <td className="p-2">{c.enrolled}/{c.maxSeats}</td>
                <td className="p-2">
                  {reg ? reg.status : 'Not Registered'}
                </td>
                <td className="p-2">
                  {!reg && c.enrolled < c.maxSeats && (
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
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
  );
}
