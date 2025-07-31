// api-gateway/routes/course.js
const express = require('express');
const router  = express.Router();
const { verifyToken, authorizeRoles } = require('../middlewares/auth');
const ctrl = require('../controllers/courseController');

// Finance/Admin: manage courses
router.post(
  '/create',
  verifyToken,
  authorizeRoles('Finance'),
  ctrl.createCourse
);
router.put(
  '/update/:code',
  verifyToken,
  authorizeRoles('Finance'),
  ctrl.updateCourse
);
router.delete(
  '/delete/:code',
  verifyToken,
  authorizeRoles('Finance'),
  ctrl.deleteCourse
);

// Student-facing
router.get(
  '/list',
  verifyToken,
  authorizeRoles('Student','Finance'),
  ctrl.listCourses
);
router.post(
  '/register',
  verifyToken,
  authorizeRoles('Student'),
  ctrl.registerCourse
);
router.get(
  '/my',
  verifyToken,
  authorizeRoles('Student'),
  ctrl.getMyRegistrations
);

// Advisor
router.get(
  '/pending',
  verifyToken,
  authorizeRoles('Professor','VC'),
  ctrl.listPendingRegs
);
router.post(
  '/decide/:regId',
  verifyToken,
  authorizeRoles('Professor','VC'),
  ctrl.decideRegistration
);

module.exports = router;
