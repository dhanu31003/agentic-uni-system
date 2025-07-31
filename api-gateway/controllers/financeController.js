// api-gateway/controllers/financeController.js
const Fee = require('../models/Fee');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// GET /api/finance/fees
const getFees = async (req, res) => {
  try {
    const fees = await Fee.find().sort({ dueDate: 1 });
    res.json(fees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load fees' });
  }
};

// POST /api/finance/fees/:studentId/mark-paid
const markPaid = async (req, res) => {
  const { studentId } = req.params;
  try {
    const fee = await Fee.findOneAndUpdate(
      { studentId },
      { status: 'Paid' },
      { new: true }
    );
    if (!fee) return res.status(404).json({ message: 'Fee record not found' });
    res.json(fee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update status' });
  }
};

// POST /api/finance/fees/notify
const notifyDues = async (req, res) => {
  try {
    const dues = await Fee.find({ status: { $in: ['Pending','Overdue'] } });
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: +process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const sentTo = [];
    for (let fee of dues) {
      const student = await User.findOne({ studentId: fee.studentId, role: 'Student' });
      if (!student) continue;

      const total = fee.academicFee + fee.hostelFee + fee.messFee + fee.miscFee;
      const mailOpts = {
        from:    process.env.MAIL_FROM,
        to:      student.email,
        subject: '⚠️ Fee Due Reminder',
        text: `Hello ${student.name},\n\nYour total fee of ₹${total} is ${fee.status.toLowerCase()} and due on ${fee.dueDate.toDateString()}. Please pay at the earliest.\n\nRegards,\nUniversity Finance`,
      };
      await transporter.sendMail(mailOpts);
      sentTo.push(student.email);
    }

    res.json({ message: 'Notifications sent', count: sentTo.length, sentTo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Notification failed' });
  }
};

module.exports = { getFees, markPaid, notifyDues };
