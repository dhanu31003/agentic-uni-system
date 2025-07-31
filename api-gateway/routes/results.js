const express = require('express');
const router  = express.Router();
const { verifyToken, authorizeRoles } = require('../middlewares/auth');
const {
  uploadResult,
  getPending,
  getAggregatedResults,
  approveResult
} = require('../controllers/resultsController');

router.post(
  '/upload',
  verifyToken,
  authorizeRoles('Professor'),
  uploadResult
);

router.get(
  '/pending',
  verifyToken,
  authorizeRoles('Professor','VC'),
  getPending
);

router.get(
  '/aggregate',
  verifyToken,
  authorizeRoles('Professor','VC'),
  getAggregatedResults
);

router.post(
  '/approve/:studentId',
  verifyToken,
  authorizeRoles('VC'),
  approveResult
);

module.exports = router;
