const Club = require('../models/club');
const User = require('../models/user');
const mongoose = require('mongoose');

module.exports.index = async (req, res) => {
    const clubs = await Club.find({});
    res.render('clubs/index', { clubs });
};

module.exports.renderNewForm = (req, res) => {
    res.render('clubs/new');
};

module.exports.createClub = async (req, res, next) => {
    const club = new Club(req.body.club);
    const user = await User.findById(req.user._id);
    club.admin = req.user._id;
    user.adminOf.push(club);
    await club.save();
    await user.save();
    req.flash('success', 'Successfully made a new Club!');
    res.redirect(`/clubs/${club._id}`);
};

module.exports.showClub = async (req, res) => {
    const foundClub = await Club.findById(req.params.id);
    if (!foundClub || !mongoose.Types.ObjectId.isValid(req.params.id)) {
        req.flash('error', 'Club Not Found !!!');
        return res.redirect('/clubs');
    }
    const club = await (await Club.findById(req.params.id)).populate('admin').execPopulate();
    res.render('clubs/show', { club });
};

module.exports.renderEditForm = async (req, res) => {
    const id = req.params.id;
    const club = await Club.findById(id);
    if (!club || !mongoose.Types.ObjectId.isValid(id)) {
        req.flash('error', 'Club Not Found !!!');
        return res.redirect('/clubs');
    }
    res.render('clubs/edit', { club });
};

module.exports.updateClub = async (req, res) => {
    const id = req.params.id;
    const club = await Club.findByIdAndUpdate(id, { ...req.body.club });
    req.flash('success', 'Successfully updated the Club!');
    res.redirect(`/clubs/${club._id}`);
};

module.exports.deleteClub = async (req, res) => {
    const id = req.params.id;
    await Club.findByIdAndDelete(id);
    req.flash('success', 'Your club was successfully deleted');
    res.redirect('/clubs');
};

module.exports.joinClub = async (req, res) => {
    const club = await Club.findById(req.params.id);
    const user = await User.findById(req.user._id);
    if (club.admin.equals(user._id)) {
        req.flash('error', `You are the admin of the club`);
        return res.redirect(`/clubs/${club._id}`);
    }
    if (club.members.indexOf(user._id) == -1) {
        user.memberOf.push(club);
        club.members.push(req.user);
    } else {
        req.flash('error', `You are already the member of this club`);
        return res.redirect(`/clubs/${club._id}`);
    }
    await club.save();
    await user.save();
    req.flash('success', `Congratulations, You are now a member of ${club.name} club`);
    res.redirect(`/clubs/${club._id}`);
};
