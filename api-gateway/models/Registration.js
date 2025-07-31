// api-gateway/models/Registration.js
const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  studentId:   { type: String, required: true },
  courseCode:  { type: String, required: true },
  status:      { type: String, enum: ['Pending','Approved','Rejected'], default: 'Pending' },
  requestedAt: { type: Date, default: Date.now },
  decisionAt:  { type: Date }
}, { timestamps: true });

registrationSchema.index({ studentId: 1, courseCode: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
