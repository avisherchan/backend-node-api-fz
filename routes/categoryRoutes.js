const express = require('express');
const router = express.Router();
const {
    create,
    categoryById,
    getCategory,
    updateCategory,
    removeCategory,
    list
} = require('../functions/category')
const { requireLogin, isAdmin } = require('../functions/auth')
const { userById } = require('../functions/user');

router.get('/category/:categoryId', getCategory)
router.post('/category/create/:userId', isAdmin, create);
router.put('/category/:categoryId/:userId', isAdmin, updateCategory);
router.delete('/category/:categoryId/:userId', isAdmin, removeCategory);
router.get("/categories", list);

router.param('categoryId', categoryById)
router.param('userId', userById);

module.exports = router;