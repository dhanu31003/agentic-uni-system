// api-gateway/models/CalendarEvent.js
const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
  date:        { type: Date,   required: true },
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  eventType:   { 
    type: String,
    enum: ['Holiday','Exam','Class','Other'],
    default: 'Other'
  }
}, { timestamps: true });

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);
