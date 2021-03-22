const User = require('../models/user');
const Club = require('../models/club');

module.exports.userShowPage = async (req, res) => {
    const foundUser = await User.find({ username: req.params.username }).populate('memberOf').populate('adminOf');
    const user = foundUser[0];
    res.render('users/show', { user });
};

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
};

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password, description } = req.body;
        const user = new User({ email, username, description });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', `Welcome, You have been successfully registered ${username}!`);
            res.redirect('/clubs');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
};

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
};

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome Back, You have been successfully logged in!');
    const redirectUrl = req.session.returnTo || '/clubs';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye, Logged you out successfully');
    res.redirect('/clubs');
};

module.exports.makeAdmin = async (req, res) => {
    const { id, userID } = req.params;
    const club = await Club.findById(id);
    const user = await User.findById(userID);
    club.members.splice(club.members.indexOf(user._id), 1);
    club.admins.push(user._id);
    user.memberOf.splice(user.memberOf.indexOf(club._id), 1);
    user.adminOf.push(club._id);
    await club.save();
    await user.save();
    res.redirect(`/clubs/${id}/chat`);
}

module.exports.getYourClubsPage = async (req, res) => {
    const user = await User.findById(req.user._id).populate('adminOf').populate('memberOf');
    res.render('chatIndex', { user });
}