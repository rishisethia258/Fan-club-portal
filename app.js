const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { clubSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Club = require('./models/club');

mongoose.connect('mongodb://localhost:27017/fan-club', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateClub = (req, res, next) => {
    const { error } = clubSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home');
});
app.get('/clubs', catchAsync(async (req, res) => {
    const clubs = await Club.find({});
    res.render('clubs/index', { clubs });
}));

app.get('/clubs/new', (req, res) => {
    res.render('clubs/new');
});

app.post('/clubs', validateClub, catchAsync(async (req, res, next) => {
    const club = new Club(req.body.club);
    await club.save();
    res.redirect(`/clubs/${club._id}`);
}));

app.get('/clubs/:id', catchAsync(async (req, res) => {
    const club = await Club.findById(req.params.id);
    res.render('clubs/show', { club });
}));

app.get('/clubs/:id/edit', catchAsync(async (req, res) => {
    const club = await Club.findById(req.params.id);
    res.render('clubs/edit', { club });
}));

app.put('/clubs/:id', catchAsync(async (req, res) => {
    const id = req.params.id;
    const club = await Club.findByIdAndUpdate(id, { ...req.body.club });
    res.redirect(`/clubs/${club._id}`);
}));

app.delete('/clubs/:id', catchAsync(async (req, res) => {
    const id = req.params.id;
    await Club.findByIdAndDelete(id);
    res.redirect('/clubs');
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found!', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong';
    res.status(statusCode).render('error', { err })
});

app.listen(3000, () => {
    console.log('Serving on port 3000');
});