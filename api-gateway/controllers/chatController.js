// api-gateway/controllers/chatController.js
const OpenAI       = require('openai');
const multer       = require('multer');
const path         = require('path');
const fs           = require('fs');
const User         = require('../models/User');
const Fee          = require('../models/Fee');
const FinalResult  = require('../models/FinalResult');

// init OpenAI v4
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// file‐upload setup (unchanged)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname,'../uploads/chat');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});
const upload = multer({ storage });
module.exports.uploadFile = [
  upload.single('file'),
  (req, res) => res.json({ filename: req.file.filename })
];

async function handleMessage(req, res) {
  // 1) Identify the user and their studentId
  const user = await User.findById(req.user.userId);
  if (!user) {
    return res.status(401).json({ reply: 'Unauthorized' });
  }
  const sid = user.studentId;
  
  // 2) If this account has no studentId (e.g. Finance/Professor), refuse student lookups
  if (!sid && /fee|result/i.test(req.body.message)) {
    return res.json({
      reply:
        'I can only look up fees and results for student accounts. ' +
        'Please ask your student to query directly, or contact Finance.'
    });
  }

  const text = (req.body.message||'').trim();

  // 3) Fee query → always use logged-in student’s ID
  if (/fee/i.test(text)) {
    const feeRec = await Fee.findOne({ studentId: sid });
    if (!feeRec) {
      return res.json({ reply: `No fee records found for your account (${sid}).` });
    }
    const { academicFee, hostelFee, messFee, miscFee, status, dueDate } = feeRec;
    const total = academicFee + hostelFee + messFee + miscFee;
    return res.json({
      reply:
        `Your fees (ID ${sid}):\n` +
        `• Academic: ₹${academicFee}\n` +
        `• Hostel:   ₹${hostelFee}\n` +
        `• Mess:     ₹${messFee}\n` +
        `• Misc:     ₹${miscFee}\n` +
        `→ Total: ₹${total}\n` +
        `Status: ${status} (due by ${new Date(dueDate).toLocaleDateString()})`
    });
  }

  // 4) Result query → always use logged-in student’s ID
  if (/result/i.test(text)) {
    const fr = await FinalResult.findOne({ studentId: sid, approved: true });
    if (!fr) {
      return res.json({ reply: `No approved results found for your account (${sid}).` });
    }
    const lines = fr.subjects.map(s => `• ${s.subject}: ${s.marks}`).join('\n');
    return res.json({
      reply:
        `Your results (ID ${sid}):\n${lines}\n` +
        `Total: ${fr.total}\nAverage: ${fr.average.toFixed(2)}`
    });
  }

  // 5) Other ERP topics → fallback to LLM if in scope
  const ALLOWED = ['fees','results','courses','attendance','calendar','credentials'];
  if (!ALLOWED.some(t => text.toLowerCase().includes(t))) {
    return res.json({
      reply:
        'I’m sorry, I can only answer ERP-related queries about ' +
        'fees, results, courses, attendance, calendar, or credentials.'
    });
  }

  // 6) LLM for everything else
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are the university ERP assistant. Only answer queries about ' +
            'fees, results, course registration, attendance, academic calendar, or credentials.'
        },
        { role: 'user', content: text }
      ],
      temperature: 0
    });
    const reply = completion.choices[0].message.content;
    return res.json({ reply });
  } catch (err) {
    console.error('Chatbot error:', err);
    return res.status(500).json({ reply: 'Chatbot error, please try again later.' });
  }
}

module.exports.handleMessage = handleMessage;
