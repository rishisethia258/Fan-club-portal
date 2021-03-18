const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Chat = require('../models/chat');
const Club = require('../models/club');
const { isLoggedIn, validateChat, isAuthor } = require('../middleware/middleware');

router.get('/', isLoggedIn, catchAsync(async (req, res) => {
    const club = await Club.findById(req.params.id).populate({ path: 'chats', populate: { path: 'author' } });
    res.render('chat', { club });
}));

router.post('/', isLoggedIn, validateChat, catchAsync(async (req, res) => {
    const club = await Club.findById(req.params.id);
    const chat = new Chat(req.body.chat);
    chat.author = req.user._id;
    club.chats.push(chat);
    await chat.save();
    await club.save();
    req.flash('success', 'Added your message in chatbox');
    res.redirect(`/clubs/${club._id}/chat`);
}));

router.delete('/:chatId', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id, chatId } = req.params;
    await Club.findByIdAndUpdate(id, { $pull: { chats: chatId } })
    await Chat.findByIdAndDelete(chatId);
    req.flash('success', 'Your message was successfully deleted');
    res.redirect(`/clubs/${id}/chat`);
}));

module.exports = router;
