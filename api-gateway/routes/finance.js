const express = require('express');
const router  = express.Router();
const { verifyToken, authorizeRoles } = require('../middlewares/auth');
const { getFees, markPaid, notifyDues } = require('../controllers/financeController');

router.get(
  '/fees',
  verifyToken,
  authorizeRoles('Finance'),
  getFees
);

router.post(
  '/fees/:studentId/mark-paid',
  verifyToken,
  authorizeRoles('Finance'),
  markPaid
);

router.post(
  '/fees/notify',
  verifyToken,
  authorizeRoles('Finance'),
  notifyDues
);

module.exports = router;
