const mongoose = require('mongoose');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: 32
    },
    hpass: {
        type: String,
        required: true
    },
    about: {
        type: String,
        trim: true,
    },
    salt: String,
    role: {
        type: Number,
        default: 0
    },
    history: {
        type: Array,
        default: []
    },
    verified: {
        type: Boolean,
        default: false
    },
    number: {
        type: Number,
        required: false,
    },
    resetPasswordLink: {
        data: String,
        default: ""
    }
}, { timestamps: true });

userSchema.virtual('password')
.set(function(password) {
    this._password = password
    this.salt = uuidv4()
    this.hpass = this.hashPassword(password)
})
.get(function() {
    return this._password
})

userSchema.methods = {
    authenticate: function(plain_text) {
        return this.hashPassword(plain_text) === this.hpass;
    },

    hashPassword: function(password) {
        if(!password) return '';
        try {
            return crypto.createHmac('sha1', this.salt)
                            .update(password)
                            .digest('hex')
        } catch (err) {
            return '';
        }
    }
};

module.exports = mongoose.model('User', userSchema)