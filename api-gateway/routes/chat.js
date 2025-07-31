// api-gateway/routes/chat.js
const express = require('express');
const router  = express.Router();
const { verifyToken } = require('../middlewares/auth');
const { uploadFile, handleMessage } = require('../controllers/chatController');

// allow any authenticated role to chat/upload
router.post('/upload', verifyToken, uploadFile);
router.post('/message', verifyToken, handleMessage);

module.exports = router;
