const express = require('express');
const router = express.Router();
const {getSenderId, getRecieverId, createChat, createMessage, chatById, getChats, getMessages} = require('../functions/message');

router.post('/new/chat', createChat)
router.post('/new/message', createMessage)
router.get('/chats', getChats)

router.param('chatId', chatById)

module.exports = router;