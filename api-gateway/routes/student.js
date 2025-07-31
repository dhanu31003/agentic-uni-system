const express = require('express');
const router  = express.Router();
const { verifyToken, authorizeRoles } = require('../middlewares/auth');
const { getMyFees } = require('../controllers/studentController');
const { getMyResults } = require('../controllers/studentController');

router.get(
  '/fees',
  verifyToken,
  authorizeRoles('Student'),
  getMyFees
);

router.get(
   '/results',
   verifyToken,
   authorizeRoles('Student'),
   getMyResults
 );

module.exports = router;
