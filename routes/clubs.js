const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateClub, isAdmin } = require('../middleware/middleware');
const Club = require('../models/club');
const mongoose = require('mongoose');

router.get('/', catchAsync(async (req, res) => {
    const clubs = await Club.find({});
    res.render('clubs/index', { clubs });
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('clubs/new');
});

router.post('/', isLoggedIn, validateClub, catchAsync(async (req, res, next) => {
    const club = new Club(req.body.club);
    club.admin = req.user._id;
    await club.save();
    req.flash('success', 'Successfully made a new Club!');
    res.redirect(`/clubs/${club._id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    const foundClub = await Club.findById(req.params.id);
    if (!foundClub || !mongoose.Types.ObjectId.isValid(req.params.id)) {
        req.flash('error', 'Club Not Found !!!');
        return res.redirect('/clubs');
    }
    const club = await (await Club.findById(req.params.id)).populate('admin').execPopulate();
    res.render('clubs/show', { club });
}));

router.get('/:id/edit', isLoggedIn, isAdmin, catchAsync(async (req, res) => {
    const id = req.params.id;
    const club = await Club.findById(id);
    if (!club || !mongoose.Types.ObjectId.isValid(id)) {
        req.flash('error', 'Club Not Found !!!');
        return res.redirect('/clubs');
    }
    res.render('clubs/edit', { club });
}));

router.put('/:id', isLoggedIn, isAdmin, validateClub, catchAsync(async (req, res) => {
    const id = req.params.id;
    const club = await Club.findByIdAndUpdate(id, { ...req.body.club });
    req.flash('success', 'Successfully updated the Club!');
    res.redirect(`/clubs/${club._id}`);
}));

router.delete('/:id', isLoggedIn, isAdmin, catchAsync(async (req, res) => {
    const id = req.params.id;
    await Club.findByIdAndDelete(id);
    req.flash('success', 'Your club was successfully deleted');
    res.redirect('/clubs');
}));

module.exports = router;