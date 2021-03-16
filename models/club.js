const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClubSchema = new Schema({
    name: String,
    image: String,
    description: String
});

module.exports = mongoose.model('Club', ClubSchema);