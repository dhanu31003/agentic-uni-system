import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export default function ResultsManagement() {
  const [subject, setSubject] = useState('');
  const [file, setFile] = useState(null);
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
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Result Aggregation</h2>

        {/* Upload Form */}
        <form onSubmit={handleUpload} className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Subject Code</label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="e.g., MATH101"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Result File</label>
              <div className="relative">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={e => setFile(e.target.files[0])}
                  required
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-medium
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>
            </div>
          </div>
          <button 
            type="submit" 
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-600 transition-all shadow-md"
          >
            Upload Results
          </button>
        </form>

        {/* Pending Uploads */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Pending Result Files</h3>
          {pending.length === 0 ? (
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center text-gray-500">
              No pending uploads
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filename</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded At</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pending.map(f => (
                    <tr key={f.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{f.subject}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{f.filename}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(f.uploadedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}