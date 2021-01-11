const { Model } = require('mongoose');
const {} = require('mongoose')
const User = require('../schemas/user');
const mongoose = require('mongoose');
const accountSID = 'AC1a101a19b21b7a1451958be533bc2a8f'
const authToken = 'c05a4e8046b3e60825a7a4ea37caff9b'
const config = require('../config')
const client = require('twilio')(accountSID, authToken)

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if(err||!user){
            return res.status(400).json({
                error: 'User not found'
            })
        }
        req.profile = user;
        next();
    });
}

exports.readUser = (req, res) => {
    req.profile.hpass = undefined
    req.profile.salt = undefined
    return res.json(req.profile);
}

exports.updateUser = (req, res) => {
    User.findOneAndUpdate(
        {_id: req.profile._id}, 
        {$set: req.body}, 
        {new: true},
        (err, user) => {
            if(err) {
                return res.status(400).json({
                    error: 'User not authorized to perform this action'
                })
            }
            user.hpass = undefined;
            user.salt = undefined;
            res.json(user)
        }
    )
}

exports.sendCode = (req, res) => {
    client.verify.services('VAe8d35c0a2ff87538a4e2f3f687893ff6')
                .verifications
                .create({to: `+977${req.query.number}`, channel: 'sms'})
                .then(verification => res.send(verification));
}

exports.verify = (req, res) => {
    client
        .verify
        .services('VAe8d35c0a2ff87538a4e2f3f687893ff6')
        .verificationChecks
        .create({
            to: `+977${req.query.number}`,
            code: req.query.code
        })
        .then((data) => {
            if(data.status === 'approved') {
                return res.status(200).json({
                    message: 'Verification Successful'
                })
            } else {
                return res.json({
                    error: 'Wrong code'
                })
            }
        })
}

exports.verified = (req, res) => {
    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$set: {verified: true}},
        {new: true},
        (err, user) => {
            if(err) {
                return res.json({
                    error: err
                })
            }
            user.verified = true;
            res.json(user)
        }
    )
}

exports.setNumber = (req, res) => {
    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$set: {number: req.query.number}},
        {new: true},
        (err, user) => {
            if(err) {
                return res.json({
                    error: err
                })
            }
            user.number = req.query.number
            res.json({
                message: 'Number saved.'
            })
        }
    )
}