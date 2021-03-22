const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    message: String,
    createdAt: { type: Date, default: Date.now },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model("Chat", chatSchema);