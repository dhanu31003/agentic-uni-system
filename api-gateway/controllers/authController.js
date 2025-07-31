// api-gateway/controllers/authController.js
const Fee  = require('../models/Fee');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { name, email, password, role, studentId } = req.body;
  try {
    // 1. Ensure email unique
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    // 2. If student, require studentId
    if (role === 'Student' && !studentId) {
      return res.status(400).json({ message: 'studentId required for Student role' });
    }
    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    // 4. Build user object
    const newUser = { name, email, password: hash, role };
    if (role === 'Student') newUser.studentId = studentId;
    // 5. Save
    const user = await User.create(newUser);
    if (role === 'Student') {
  // default due date 30 days out
  const due = new Date();
  due.setDate(due.getDate() + 30);

  await Fee.create({
    studentId:   user.studentId,
    name:        user.name,
    academicFee: 15000,
    hostelFee:   0,
    messFee:     0,
    miscFee:     0,
    status:      'Pending',
    dueDate:     due
  });
}
    // 6. Sign JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    // 2. Compare
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    // 3. Sign JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login };
