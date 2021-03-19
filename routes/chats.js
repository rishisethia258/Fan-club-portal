const express = require('express');
const router = express.Router({ mergeParams: true });
const chats = require('../controllers/chats');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateChat, isAuthor, isMemberOrAdmin } = require('../middleware/middleware');

router.route('/')
    .get(isLoggedIn, isMemberOrAdmin, catchAsync(chats.showChatPage))
    .post(isLoggedIn, validateChat, catchAsync(chats.createChat));

router.delete('/:chatId', isLoggedIn, isAuthor, catchAsync(chats.deleteChat));

module.exports = router;