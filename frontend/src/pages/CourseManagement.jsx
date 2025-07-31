// frontend/src/pages/CourseManagement.jsx
import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export default function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [form, setForm]       = useState({
    code: '', name: '', credits: '', prerequisites: '', maxSeats: ''
  });
  const [error, setError]     = useState('');

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
    <div>
      <h2 className="text-2xl mb-4">Course Management</h2>
      {error && <p className="text-red-600">{error}</p>}
      <form onSubmit={handleCreate} className="mb-6 grid grid-cols-5 gap-2">
        <input name="code" placeholder="Code"      value={form.code} onChange={handleChange} required className="p-2 border" />
        <input name="name" placeholder="Name"      value={form.name} onChange={handleChange} required className="p-2 border" />
        <input name="credits" placeholder="Credits" value={form.credits} onChange={handleChange} required className="p-2 border" />
        <input name="prerequisites" placeholder="Prereq (csv)" value={form.prerequisites} onChange={handleChange} className="p-2 border" />
        <input name="maxSeats" placeholder="Max Seats" value={form.maxSeats} onChange={handleChange} required className="p-2 border" />
        <button type="submit" className="col-span-5 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Add Course
        </button>
      </form>

      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Code</th>
            <th className="p-2">Name</th>
            <th className="p-2">Credits</th>
            <th className="p-2">Prereq</th>
            <th className="p-2">Seats</th>
            <th className="p-2">Enrolled</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(c => (
            <tr key={c.code} className="border-t">
              <td className="p-2">{c.code}</td>
              <td className="p-2">{c.name}</td>
              <td className="p-2">{c.credits}</td>
              <td className="p-2">{c.prerequisites.join(', ') || 'None'}</td>
              <td className="p-2">{c.maxSeats}</td>
              <td className="p-2">{c.enrolled}</td>
              <td className="p-2 space-x-2">
                <button
                  className="px-2 py-1 bg-yellow-500 text-white rounded"
                  onClick={() => handleUpdate(c.code)}
                >
                  Edit
                </button>
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded"
                  onClick={() => handleDelete(c.code)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
