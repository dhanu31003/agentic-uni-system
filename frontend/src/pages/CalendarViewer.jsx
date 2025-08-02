import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function CalendarViewer() {
  const [events, setEvents] = useState([]);
  
  useEffect(() => {
    api.get('/calendar/events').then(res => setEvents(res.data));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Academic Calendar</h2>
        
        <div className="space-y-4">
          {events.map(e => (
            <div key={e._id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-100 text-blue-800 rounded-lg p-3 mr-4">
                  <div className="text-sm font-medium">
                    {new Date(e.date).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                  <div className="text-xl font-bold text-center">
                    {new Date(e.date).getDate()}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {e.title} <span className="text-sm font-normal text-gray-500 ml-2">({e.eventType})</span>
                  </h3>
                  {e.description && (
                    <p className="mt-1 text-gray-600">{e.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}