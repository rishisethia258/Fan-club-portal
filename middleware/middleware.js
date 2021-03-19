const { clubSchema, chatSchema } = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');
const Club = require('../models/club');
const Chat = require('../models/chat');
const club = require('../models/club');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateClub = (req, res, next) => {
    const { error } = clubSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isAdmin = async (req, res, next) => {
    const { id } = req.params;
    const foundClub = await Club.findById(id);
    if (!foundClub.admin.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/clubs/${id}`);
    }
    next();
}

module.exports.validateChat = (req, res, next) => {
    const { error } = chatSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id, chatId } = req.params;
    const chat = await Chat.findById(chatId);
    if (!chat.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/clubs/${id}/chat`);
    }
    next();
}

module.exports.isMemberOrAdmin = async (req, res, next) => {
    const { id } = req.params;
    const foundClub = await Club.findById(id);
    if (foundClub.admin.equals(req.user._id) || foundClub.members.indexOf(req.user._id) !== -1) {
        return next();
    }
    req.flash('error', 'You shall join the club first');
    return res.redirect(`/clubs/${id}`);
}
