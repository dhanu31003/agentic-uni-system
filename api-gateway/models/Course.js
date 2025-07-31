// api-gateway/models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  code:         { type: String, required: true, unique: true },
  name:         { type: String, required: true },
  credits:      { type: Number, required: true },
  prerequisites:{ type: [String], default: [] }, // array of course codes
  maxSeats:     { type: Number, required: true },
  enrolled:     { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
