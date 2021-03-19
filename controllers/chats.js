const Chat = require('../models/chat');
const Club = require('../models/club');

module.exports.showChatPage = async (req, res) => {
    const club = await (await Club.findById(req.params.id).populate({ path: 'chats', populate: { path: 'author' } }).populate('members')).populate('admin').execPopulate();
    res.render('chat', { club });
};

module.exports.createChat = async (req, res) => {
    const club = await Club.findById(req.params.id);
    const chat = new Chat(req.body.chat);
    chat.author = req.user._id;
    club.chats.push(chat);
    await chat.save();
    await club.save();
    req.flash('success', 'Added your message in chatbox');
    res.redirect(`/clubs/${club._id}/chat`);
};

module.exports.deleteChat = async (req, res) => {
    const { id, chatId } = req.params;
    await Club.findByIdAndUpdate(id, { $pull: { chats: chatId } })
    await Chat.findByIdAndDelete(chatId);
    req.flash('success', 'Your message was successfully deleted');
    res.redirect(`/clubs/${id}/chat`);
};