const Chat = require('../models/chat');
const Club = require('../models/club');

module.exports.showChatPage = async (req, res) => {
    const clubDetails = await Club.findById(req.params.id);
    let isAdmin = false;
    if (clubDetails.admins.indexOf(req.user._id) != -1) {
        isAdmin = true;
    }
    const club = await (await Club.findById(req.params.id).populate({ path: 'chats', populate: { path: 'author' } }).populate('members')).populate('admins').execPopulate();
    club.isAdmin = isAdmin;
    res.render('chat', { club });
};

module.exports.createChat = async (req, res) => {
    const club = await Club.findById(req.params.id);
    const chat = new Chat(req.body.chat);
    chat.author = req.user._id;
    club.chats.push(chat);
    await chat.save();
    await club.save();
    res.redirect(`/clubs/${club._id}/chat`);
};

module.exports.deleteChat = async (req, res) => {
    const { id, chatId } = req.params;
    await Club.findByIdAndUpdate(id, { $pull: { chats: chatId } })
    await Chat.findByIdAndDelete(chatId);
    res.redirect(`/clubs/${id}/chat`);
};