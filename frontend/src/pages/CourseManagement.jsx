import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export default function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    code: '', name: '', credits: '', prerequisites: '', maxSeats: ''
  });
  const [error, setError] = useState('');

  const fetch = async () => {
    const { data } = await api.get('/course/list');
    setCourses(data);
  };

  useEffect(() => { fetch(); }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async e => {
    e.preventDefault();
    try {
      await api.post('/course/create', {
        ...form,
        credits: +form.credits,
        maxSeats: +form.maxSeats,
        prerequisites: form.prerequisites
          .split(',').map(s => s.trim()).filter(Boolean)
      });
      setForm({ code:'', name:'', credits:'', prerequisites:'', maxSeats:'' });
      fetch();
    } catch (err) {
      setError(err.response?.data?.message || 'Create failed');
    }
  };

  const handleUpdate = async code => {
    const newSeats = prompt('New max seats:', '0');
    if (newSeats == null) return;
    try {
      await api.put(`/course/update/${code}`, { maxSeats: +newSeats });
      fetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async code => {
    if (!window.confirm(`Delete course ${code}?`)) return;
    try {
      await api.delete(`/course/delete/${code}`);
      fetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Course Management</h2>
        
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
        
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <input 
            name="code" placeholder="Course Code" 
            value={form.code} onChange={handleChange} 
            required 
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input 
            name="name" placeholder="Course Name" 
            value={form.name} onChange={handleChange} 
            required 
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input 
            name="credits" placeholder="Credits" 
            value={form.credits} onChange={handleChange} 
            required 
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input 
            name="prerequisites" placeholder="Prerequisites (csv)" 
            value={form.prerequisites} onChange={handleChange} 
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input 
            name="maxSeats" placeholder="Max Seats" 
            value={form.maxSeats} onChange={handleChange} 
            required 
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button 
            type="submit" 
            className="col-span-1 md:col-span-5 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg font-medium hover:from-green-700 hover:to-green-600 transition-all shadow-md"
          >
            Add Course
          </button>
        </form>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prerequisites</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seats</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map(c => (
                <tr key={c.code} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.credits}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {c.prerequisites.join(', ') || 'None'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.maxSeats}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.enrolled}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleUpdate(c.code)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c.code)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
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