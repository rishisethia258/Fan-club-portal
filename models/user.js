const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    adminOf: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Club'
        }
    ],
    memberOf: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Club'
        }
    ],
    description: {
        type: String,
        required: true
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);