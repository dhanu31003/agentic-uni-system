import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export default function ResultsManagement() {
  const [subject, setSubject] = useState('');
  const [file, setFile]       = useState(null);
  const [pending, setPending] = useState([]);

  const fetchPending = async () => {
    const { data } = await api.get('/results/pending');
    setPending(data);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleUpload = async e => {
    e.preventDefault();
    if (!subject || !file) return alert('Subject & file required');
    const form = new FormData();
    form.append('file', file);
    const { data } = await api.post(`/results/upload?subject=${subject}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    alert(data.message);
    setSubject('');
    setFile(null);
    fetchPending();
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Result Aggregation</h2>

      {/* Upload Form */}
      <form onSubmit={handleUpload} className="mb-6">
        <label className="block mb-2">Subject Code</label>
        <input
          type="text"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          required
          className="w-1/3 p-2 border rounded mb-4"
        />
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={e => setFile(e.target.files[0])}
          required
          className="mb-4"
        />
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
          Upload
        </button>
      </form>

      {/* Pending Uploads */}
      <h3 className="text-xl mb-2">Pending Files</h3>
      <ul className="list-disc pl-5">
        {pending.map(f => (
          <li key={f.id}>
            {f.subject} — {new Date(f.uploadedAt).toLocaleString()} ({f.filename})
          </li>
        ))}
        {pending.length === 0 && <li>No pending uploads</li>}
      </ul>
    </div>
  );
}
