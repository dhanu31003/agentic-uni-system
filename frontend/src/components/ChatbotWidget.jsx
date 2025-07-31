// frontend/src/components/ChatbotWidget.jsx
import React, { useState, useRef } from 'react';
import api from '../utils/api';

export default function ChatbotWidget() {
  const [open, setOpen]     = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput]   = useState('');
  const [file, setFile]     = useState(null);
  const bottomRef = useRef();

  const sendMessage = async () => {
    if (input.trim() === '') return;
    const userMsg = { from: 'user', text: input };
    setMessages(msgs => [...msgs, userMsg]);
    setInput('');

    // handle file upload first if present
    if (file) {
      const fd = new FormData();
      fd.append('file', file);
      const up = await api.post('/chat/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessages(msgs => [...msgs, { from: 'bot', text: `File received: ${up.data.filename}` }]);
      setFile(null);
    }

    // then chat message
    const { data } = await api.post('/chat/message', { message: userMsg.text });
    setMessages(msgs => [...msgs, { from: 'bot', text: data.reply }]);

    bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Chat icon */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg"
      >
        💬
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end">
          <div className="bg-white w-full md:w-1/3 h-3/4 rounded-t-lg flex flex-col">
            {/* Header */}
            <div className="p-4 border-b flex justify-between">
              <h2 className="text-lg">ERP Assistant</h2>
              <button onClick={() => setOpen(false)}>✖️</button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-auto">
              {messages.map((m,i) => (
                <div key={i} className={`mb-2 ${m.from==='user'?'text-right':'text-left'}`}>
                  <span className={`inline-block px-3 py-2 rounded ${
                    m.from==='user'?'bg-blue-100':'bg-gray-100'
                  }`}>
                    {m.text}
                  </span>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <input
                type="file"
                onChange={e => setFile(e.target.files[0])}
                className="mb-2"
              />
              <div className="flex">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key==='Enter' && sendMessage()}
                  className="flex-1 border p-2 rounded-l"
                  placeholder="Ask about fees, results, courses…"
                />
                <button
                  onClick={sendMessage}
                  className="px-4 bg-blue-600 text-white rounded-r"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
