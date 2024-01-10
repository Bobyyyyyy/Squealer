const express = require('express');
const replyController = require('../controllers/replyController');
const router = express.Router();

router.post('/', replyController.addReply);
router.get('/', replyController.getReplies);

module.exports = router;