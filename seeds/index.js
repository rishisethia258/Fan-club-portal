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
    const user = await User.findById('6058546322d7541294bbf9b5');
    for (let i = 0; i < seedData.length; i++) {
        const club = new Club({
            name: seedData[i].name,
            image: seedData[i].image,
            description: seedData[i].description,
            createdBy: user.username
        });
        club.admins.push(user);
        user.adminOf.push(club);
        await club.save();
    }
    await user.save();
}

seedDB().then(() => {
    mongoose.connection.close();
});