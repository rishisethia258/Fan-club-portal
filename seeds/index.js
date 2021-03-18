const mongoose = require('mongoose');
const seedData = require('./seed');
const Club = require('../models/club');

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

const seedDB = async () => {
    await Club.deleteMany({});
    for (let i = 0; i < 13; i++) {
        const club = new Club({
            admin: '60533010107dda10443f6b03',
            name: seedData[i].name,
            image: seedData[i].image,
            description: seedData[i].description
        });
        await club.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});