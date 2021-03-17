const mongoose = require('mongoose');
const Chat = require('./chat');
const Schema = mongoose.Schema;

const ClubSchema = new Schema({
    name: String,
    image: String,
    description: String,
    chats: [
        {
            type: Schema.Types.ObjectId,
            ref: "Chat"
        }
    ]
});

ClubSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Chat.deleteMany({
            _id: {
                $in: doc.chats
            }
        });
    }
});

module.exports = mongoose.model('Club', ClubSchema);