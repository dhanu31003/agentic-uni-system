// frontend/src/pages/CalendarManagement.jsx

import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export default function CalendarManagement() {
  const [events, setEvents]   = useState([]);
  const [form, setForm]       = useState({
    date: '', title: '', eventType: 'Holiday', description: ''
  });

  // 1) Move your fetch logic into a named function
  const fetchEvents = async () => {
    try {
      const { data } = await api.get('/calendar/events');
      setEvents(data);
    } catch (err) {
      console.error('Failed to load events', err);
    }
  };

  // 2) Call it from a non-async effect
  useEffect(() => {
    fetchEvents();
  }, []); // <-- no async () => here

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async e => {
    e.preventDefault();
    try {
      await api.post('/calendar/event', form);
      setForm({ date:'', title:'', eventType:'Holiday', description:'' });
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'Create failed');
    }
  };

  const handleUpdate = async id => {
    const newDesc = prompt('New description:');
    if (newDesc == null) return;
    try {
      await api.put(`/calendar/event/${id}`, { description: newDesc });
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await api.delete(`/calendar/event/${id}`);
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Manage Calendar</h2>

      <form onSubmit={handleCreate} className="mb-6 grid grid-cols-4 gap-2">
        <input
          name="date" type="date"
          value={form.date} onChange={handleChange}
          required className="p-2 border"
        />
        <input
          name="title" placeholder="Title"
          value={form.title} onChange={handleChange}
          required className="p-2 border"
        />
        <select
          name="eventType"
          value={form.eventType}
          onChange={handleChange}
          className="p-2 border"
        >
          <option>Holiday</option>
          <option>Exam</option>
          <option>Class</option>
          <option>Other</option>
        </select>
        <input
          name="description" placeholder="Description"
          value={form.description} onChange={handleChange}
          className="p-2 border"
        />
        <button
          type="submit"
          className="col-span-4 py-2 bg-green-600 text-white rounded"
        >
          Add Event
        </button>
      </form>

      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Date</th>
            <th className="p-2">Title</th>
            <th className="p-2">Type</th>
            <th className="p-2">Description</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map(e => (
            <tr key={e._id} className="border-t">
              <td className="p-2">{new Date(e.date).toLocaleDateString()}</td>
              <td className="p-2">{e.title}</td>
              <td className="p-2">{e.eventType}</td>
              <td className="p-2">{e.description}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => handleUpdate(e._id)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(e._id)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
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
