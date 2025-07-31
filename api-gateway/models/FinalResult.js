const mongoose = require('mongoose');

const finalResultSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  subjects: [
    { subject: String, marks: Number }
  ],
  total:   { type: Number, required: true },
  average: { type: Number, required: true },
  approved:   { type: Boolean, default: false },
  approvedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('FinalResult', finalResultSchema);
