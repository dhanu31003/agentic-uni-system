const User = require('../models/User');
const Fee  = require('../models/Fee');
const FinalResult = require('../models/FinalResult');

// GET /api/student/fees
const getMyFees = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user.studentId) {
      return res.status(400).json({ message: 'No studentId on profile' });
    }
    const fees = await Fee.find({ studentId: user.studentId });
    res.json(fees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load your fees' });
  }
};

// GET /api/student/results
const getMyResults = async (req, res) => {
  try {
    // 1. Find the logged-in user
    const user = await User.findById(req.user.userId);
    if (!user.studentId) {
      return res.status(400).json({ message: 'No studentId on profile' });
    }
    // 2. Fetch only approved results
    const fr = await FinalResult.findOne({
      studentId: user.studentId,
      approved:  true
    });
    if (!fr) {
      return res.status(404).json({ message: 'No approved results yet' });
    }
    // 3. Return the document
    res.json(fr);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load your results' });
  }
};

module.exports = { getMyFees, getMyResults };