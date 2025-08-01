const express = require('express');
const router  = express.Router();
const { verifyToken, authorizeRoles } = require('../middlewares/auth');
const ctrl    = require('../controllers/calendarController');

// Manual CRUD for Finance
router.post(
  '/event',
  verifyToken,
  authorizeRoles('Finance'),
  ctrl.createEvent
);
router.put(
  '/event/:id',
  verifyToken,
  authorizeRoles('Finance'),
  ctrl.updateEvent
);
router.delete(
  '/event/:id',
  verifyToken,
  authorizeRoles('Finance'),
  ctrl.deleteEvent
);

// Everyone reads
router.get(
  '/events',
  verifyToken,
  authorizeRoles('Finance','Professor','VC','Student'),
  ctrl.getEvents
);

module.exports = router;
