const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { clubSchema } = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');
const Club = require('../models/club');
const mongoose = require('mongoose');

const validateClub = (req, res, next) => {
    const { error } = clubSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const clubs = await Club.find({});
    res.render('clubs/index', { clubs });
}));

router.get('/new', (req, res) => {
    res.render('clubs/new');
});

router.post('/', validateClub, catchAsync(async (req, res, next) => {
    const club = new Club(req.body.club);
    await club.save();
    req.flash('success', 'Successfully made a new Club!');
    res.redirect(`/clubs/${club._id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        req.flash('error', 'Club Not Found !!!');
        return res.redirect('/clubs');
    }
    const club = await Club.findById(req.params.id);
    if (!club) {
        req.flash('error', 'Club Not Found !!!');
        return res.redirect('/clubs');
    }
    res.render('clubs/show', { club });
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        req.flash('error', 'Club Not Found !!!');
        return res.redirect('/clubs');
    }
    const club = await Club.findById(req.params.id);
    if (!club) {
        req.flash('error', 'Club Not Found !!!');
        return res.redirect('/clubs');
    }
    res.render('clubs/edit', { club });
}));

router.put('/:id', catchAsync(async (req, res) => {
    const id = req.params.id;
    const club = await Club.findByIdAndUpdate(id, { ...req.body.club });
    req.flash('success', 'Successfully updated the Club!');
    res.redirect(`/clubs/${club._id}`);
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const id = req.params.id;
    await Club.findByIdAndDelete(id);
    req.flash('success', 'Your club was successfully deleted');
    res.redirect('/clubs');
}));

module.exports = router;