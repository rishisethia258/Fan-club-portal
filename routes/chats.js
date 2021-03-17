const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const { chatSchema } = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');
const Chat = require('../models/chat');
const Club = require('../models/club');

const validateChat = (req, res, next) => {
    const { error } = chatSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const club = await Club.findById(req.params.id).populate('chats');
    res.render('chat', { club });
}));

router.post('/', validateChat, catchAsync(async (req, res) => {
    const club = await Club.findById(req.params.id);
    const chat = new Chat(req.body.chat);
    club.chats.push(chat);
    await chat.save();
    await club.save();
    req.flash('success', 'Added your message in chatbox');
    res.redirect(`/clubs/${club._id}/chat`);
}));

router.delete('/:chatId', catchAsync(async (req, res) => {
    const { id, chatId } = req.params;
    await Club.findByIdAndUpdate(id, { $pull: { chats: chatId } })
    await Chat.findByIdAndDelete(chatId);
    req.flash('success', 'Your message was successfully deleted');
    res.redirect(`/clubs/${id}/chat`);
}));

module.exports = router;
