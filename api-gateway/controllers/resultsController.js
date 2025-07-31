const path    = require('path');
const fs      = require('fs');
const multer  = require('multer');
const axios   = require('axios');
const FormData = require('form-data');
const FinalResult = require('../models/FinalResult');

// storage config (unchanged)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/results');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const subject = req.query.subject || 'unknown';
    const name = `${subject}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, name);
  }
});
const upload = multer({ storage });

// 1) Upload & process
const uploadResult = [
  upload.single('file'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    // forward to FastAPI
    const form = new FormData();
    form.append('subject', req.query.subject);
    form.append('file', fs.createReadStream(req.file.path), req.file.filename);

    try {
      await axios.post(
        `${process.env.FASTAPI_URL}/process/`,
        form,
        { headers: form.getHeaders() }
      );
    } catch (err) {
      console.error('FastAPI error →', err.response?.data ?? err.message);
     return res
       .status(500)
       .json({ 
         message: 'Processing failed',
         detail: err.response?.data.detail || err.message
       });
      }
    res.json({ message: 'File processed', subject: req.query.subject });
  }
];

// 2) List pending files (unchanged)
const getPending = (req, res) => {
  const dir = path.join(__dirname, '../uploads/results');
  if (!fs.existsSync(dir)) return res.json([]);
  const files = fs.readdirSync(dir).map(fn => {
    const [subject, ts] = fn.split('_');
    return { id: fn, subject, uploadedAt: new Date(parseInt(ts)), filename: fn };
  });
  res.json(files);
};

// 3) Fetch aggregated (via FastAPI)
const getAggregatedResults = async (req, res) => {
  try {
    const { data } = await axios.get(`${process.env.FASTAPI_URL}/aggregate/all`);
    // merge in any existing approval flags
    const withApproval = await Promise.all(
     data.map(async rec => {
       const fr = await FinalResult.findOne({ studentId: rec._id });
       // Only keep approved=true if totals still match
       const approved = fr?.approved === true && fr.total === rec.total;
       return {
         studentId: rec._id,
         subjects: rec.subjects,
         total: rec.total,
         average: rec.average,
         approved
       };
     })
   );
    res.json(withApproval);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Aggregation failed' });
  }
};

// 4) Approve a student’s result
const approveResult = async (req, res) => {
  const { studentId } = req.params;
  try {
    // fetch fresh aggregation
    const { data: rec } = await axios.get(
      `${process.env.FASTAPI_URL}/aggregate/${studentId}`
    );
    // upsert finalResult
    const fr = await FinalResult.findOneAndUpdate(
      { studentId },
      {
        studentId,
        subjects: rec.subjects,
        total: rec.total,
        average: rec.average,
        approved: true,
        approvedAt: new Date()
      },
      { upsert: true, new: true }
    );
    // (Optionally trigger email here…)
    res.json(fr);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Approval failed' });
  }
};

module.exports = {
  uploadResult,
  getPending,
  getAggregatedResults,
  approveResult
};
