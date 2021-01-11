const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema

const chatSchema = mongoose.Schema({
    chatName: String,
    user1: {
        type: ObjectId,
        ref: "User"
    },
    user2: {
        type: ObjectId,
        ref: "User"
    },
    conversation: [
        {
            message: String,
            user: {
                type: ObjectId,
                ref: 'User'
            }
        }
    ]
}, {timestamps: true})

module.exports = mongoose.model('Chat', chatSchema)