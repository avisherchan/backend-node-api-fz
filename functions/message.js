const mongoose = require('mongoose');
const message = require('../schemas/chat');
const User = require('../schemas/user');
const Chat = require('../schemas/chat');
const category = require('../schemas/category');

exports.chatById = (req, res, next, id) => {
    Chat.findById(id).exec((err, chat) => {
        if(err || !chat) {
            return res.status(400).json({
                error: 'Chat not found'
            })
        }
        req.chat = chat;
        next();
    })
}

exports.getChats = (req, res) => {
    Chat.find().exec((err, data) => {
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json(data)
    })
}

exports.createChat = (req, res) => {
    const chat = new Chat(req.body)
    chat.user1 = req.query.user1
    chat.user2 = req.query.user2

    chat.save((err, result) => {
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json({ result })
    })
}

exports.createMessage = (req, res) => {
    Chat.update(
        { _id: req.query.id },
        { $push: { conversation: req.body } },
        (err, data) => {
            if (err) {
                console.log('ERROR>>>', err)
                res.status(400).json({
                    error: err
                })
            }
            res.json(data)
        }
    )
}