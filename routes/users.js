const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users');
const { isLoggedIn, isAdminOfChat } = require('../middleware/middleware');
const user = require('../models/user');

router.get('/users/:username', catchAsync(users.userShowPage));

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.get('/logout', users.logout);

router.get('/yourclubs', isLoggedIn, catchAsync(users.getYourClubsPage));

router.post('/clubs/:id/users/:userID', isLoggedIn, isAdminOfChat, catchAsync(users.makeAdmin));

module.exports = router;