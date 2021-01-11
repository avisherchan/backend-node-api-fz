const express = require('express');
const router = express.Router()
const config = require('../config')
const client = require('twilio')(config.accountSID, config.authToken)
const User = require('../schemas/user');
const {
    signup,
    login,
    logout,
    requireLogin,
    forgotPassword,
    resetPassword
} = require('../functions/auth');
const {signupValid, forgotPasswordValidator, passwordResetValidator} = require('../validators');
const {accountSID, authToken, serviceID} = require('../config');
const { update } = require('../schemas/user');
const {verified} = require('../functions/user')

// forgot and reset
router.put('/forgot-password', forgotPassword);
router.put('/reset-password', passwordResetValidator, resetPassword)

router.get('/', (req, res) => res.status(200).send('Project4 with routes folder'));
router.post('/signup', signupValid, signup)
router.post('/login', login);
router.get('/logout', logout)

module.exports = router;