// api-gateway/seedFees.js
require('dotenv').config();
const mongoose = require('mongoose');
const Fee = require('./models/Fee');

const data = [
  { studentId:'S001', name:'Alice Kumar', academicFee:15000, hostelFee:8000, messFee:4000, miscFee:600, status:'Pending', dueDate:'2025-08-15' },
  { studentId:'S002', name:'Rohit Singh', academicFee:15000, hostelFee:0,    messFee:0,    miscFee:0,   status:'Paid',    dueDate:'2025-08-10' },
  { studentId:'S003', name:'Priya Patel', academicFee:15000, hostelFee:7000, messFee:3500, miscFee:300, status:'Overdue',  dueDate:'2025-08-01' },
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Fee.deleteMany({});
  await Fee.insertMany(data);
  console.log('Fees seeded');
  process.exit(0);
});
