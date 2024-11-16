const express = require('express');
const { getChatbotResponse } = require('../controllers/chatbotController');

const router = express.Router();

router.post('/message', getChatbotResponse);

module.exports = router;