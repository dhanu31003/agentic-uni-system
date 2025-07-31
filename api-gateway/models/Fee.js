const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  studentId:   { type: String, required: true, unique: true },
  name:        { type: String, required: true },
  academicFee: { type: Number, default: 0 },
  hostelFee:   { type: Number, default: 0 },
  messFee:     { type: Number, default: 0 },
  miscFee:     { type: Number, default: 0 },
  status:      { type: String, enum: ['Pending','Paid','Overdue'], default: 'Pending' },
  dueDate:     { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Fee', feeSchema);
