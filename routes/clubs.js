const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const clubs = require('../controllers/clubs');
const { isLoggedIn, validateClub, isAdmin } = require('../middleware/middleware');

router.route('/')
    .get(catchAsync(clubs.index))
    .post(isLoggedIn, validateClub, catchAsync(clubs.createClub));

router.get('/new', isLoggedIn, clubs.renderNewForm);

router.route('/:id')
    .get(catchAsync(clubs.showClub))
    .put(isLoggedIn, isAdmin, validateClub, catchAsync(clubs.updateClub))
    .delete(isLoggedIn, isAdmin, catchAsync(clubs.deleteClub));

router.get('/:id/edit', isLoggedIn, isAdmin, catchAsync(clubs.renderEditForm));
router.post('/:id/join', isLoggedIn, catchAsync(clubs.joinClub));

module.exports = router;