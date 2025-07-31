// api-gateway/controllers/courseController.js
const Course       = require('../models/Course');
const Registration = require('../models/Registration');
const User         = require('../models/User');
const FinalResult  = require('../models/FinalResult');

// 1. List all courses with availability
const listCourses = async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
};

// 2. Student registers for a course
const registerCourse = async (req, res) => {
  const { courseCode } = req.body;
  const user = await User.findById(req.user.userId);
  const sid  = user.studentId;
  // 2a. Check course exists
  const course = await Course.findOne({ code: courseCode });
  if (!course) return res.status(404).json({ message: 'Course not found' });

  // 2b. Prereq check (if any)
  if (course.prerequisites.length) {
    const fr = await FinalResult.findOne({ studentId: sid, approved: true });
    const passed = fr?.subjects.map(s => s.subject) || [];
    const missing = course.prerequisites.filter(p => !passed.includes(p));
    if (missing.length) {
      return res.status(400).json({ message: `Missing prerequisites: ${missing.join(', ')}` });
    }
  }

  // 2c. Seat check
  if (course.enrolled >= course.maxSeats) {
    return res.status(400).json({ message: 'No seats available' });
  }

  // 2d. Credit load check (max 18 credits)
  const regs      = await Registration.find({ studentId: sid, status: 'Approved' });
  const approvedCourses = await Course.find({ code: { $in: regs.map(r=>r.courseCode) }});
  const currentCredits = approvedCourses.reduce((sum,c)=>sum+c.credits,0);
  if (currentCredits + course.credits > 18) {
    return res.status(400).json({ message: 'Credit limit exceeded' });
  }

  // 2e. Create registration
  await Registration.create({ studentId: sid, courseCode });
  res.json({ message: 'Registration requested' });
};

// 3. Student views their registrations
const getMyRegistrations = async (req, res) => {
  const user = await User.findById(req.user.userId);
  const regs = await Registration.find({ studentId: user.studentId });
  res.json(regs);
};

// 4. Advisor lists pending registrations
const listPendingRegs = async (req, res) => {
  const regs = await Registration.find({ status: 'Pending' });
  res.json(regs);
};

// 5. Approve or reject
const decideRegistration = async (req, res) => {
  const { regId } = req.params;
  const { approve } = req.body; // boolean
  const reg = await Registration.findById(regId);
  if (!reg) return res.status(404).json({ message: 'Registration not found' });

  reg.status     = approve ? 'Approved' : 'Rejected';
  reg.decisionAt = new Date();
  await reg.save();

  if (approve) {
    // increment course.enrolled
    await Course.findOneAndUpdate(
      { code: reg.courseCode },
      { $inc: { enrolled: 1 } }
    );
  }
  res.json(reg);
};

// ADMIN: Create a new course
const createCourse = async (req, res) => {
  const { code, name, credits, prerequisites = [], maxSeats } = req.body;
  try {
    const exists = await Course.findOne({ code });
    if (exists) return res.status(400).json({ message: 'Course code already exists' });

    const course = await Course.create({ code, name, credits, prerequisites, maxSeats });
    res.status(201).json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create course' });
  }
};

// ADMIN: Update an existing course
const updateCourse = async (req, res) => {
  const { code } = req.params;
  const updates = req.body;
  try {
    const course = await Course.findOneAndUpdate({ code }, updates, { new: true });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update course' });
  }
};

// ADMIN: Delete a course
const deleteCourse = async (req, res) => {
  const { code } = req.params;
  try {
    const course = await Course.findOneAndDelete({ code });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Deleted course ' + code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete course' });
  }
};

module.exports = {
  listCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  registerCourse,
  getMyRegistrations,
  listPendingRegs,
  decideRegistration
};
