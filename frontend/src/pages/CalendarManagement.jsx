import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export default function CalendarManagement() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    date: '', title: '', eventType: 'Holiday', description: ''
  });

  const fetchEvents = async () => {
    try {
      const { data } = await api.get('/calendar/events');
      setEvents(data);
    } catch (err) {
      console.error('Failed to load events', err);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

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
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Calendar Events</h2>

        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <input
            name="date" type="date"
            value={form.date} onChange={handleChange}
            required 
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            name="title" placeholder="Event Title"
            value={form.title} onChange={handleChange}
            required 
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <select
            name="eventType"
            value={form.eventType}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option>Holiday</option>
            <option>Exam</option>
            <option>Class</option>
            <option>Other</option>
          </select>
          <input
            name="description" placeholder="Description"
            value={form.description} onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            className="col-span-1 md:col-span-5 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-600 transition-all shadow-md"
          >
            Add Event
          </button>
        </form>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map(e => (
                <tr key={e._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(e.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{e.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{e.eventType}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{e.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleUpdate(e._id)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(e._id)}
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