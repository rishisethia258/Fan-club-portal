const mongoose = require('mongoose');
const seedData = require('./seed');
const Club = require('../models/club');
const User = require('../models/user');

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
    const user = await User.findById('6055c5773e9ddc28bc346b13');
    for (let i = 0; i < seedData.length; i++) {
        const club = new Club({
            admin: '6055c5773e9ddc28bc346b13',
            name: seedData[i].name,
            image: seedData[i].image,
            description: seedData[i].description
        });
        user.adminOf.push(club);
        await club.save();
    }
    await user.save();
}

seedDB().then(() => {
    mongoose.connection.close();
});