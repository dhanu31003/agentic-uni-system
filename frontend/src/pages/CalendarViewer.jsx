// frontend/src/pages/CalendarViewer.jsx
import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function CalendarViewer() {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    api.get('/calendar/events').then(res => setEvents(res.data));
  }, []);
  return (
    <div>
      <h2 className="text-2xl mb-4">Academic Calendar</h2>
      <ul className="list-disc pl-5">
        {events.map(e => (
          <li key={e._id} className="mb-2">
            <strong>{new Date(e.date).toLocaleDateString()}</strong> — {e.title}{' '}
            <em>({e.eventType})</em>
            <div>{e.description}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
