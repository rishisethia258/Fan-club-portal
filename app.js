const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
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
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home');
});
app.get('/clubs', async (req, res) => {
    const clubs = await Club.find({});
    res.render('clubs/index', { clubs });
});

app.get('/clubs/:id', async (req, res) => {
    const club = await Club.findById(req.params.id);
    res.render('clubs/show', { club });
});

app.listen(3000, () => {
    console.log('Serving on port 3000');
});
