const mongoose = require('mongoose');
const seedData = require('./seed');
const Group = require('../models/group');

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
    await Group.deleteMany({});
    for (let i = 0; i < 7; i++) {
        const random = Math.floor(Math.random() * 13);
        const group = new Group(seedData[random]);
        await group.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});