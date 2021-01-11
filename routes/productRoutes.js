const express = require('express');
const router = express.Router();
const {
    createProduct,
    productById,
    getProduct,
    removeProduct,
    isSeller,
    updateProduct,
    listProduct,
    relatedList,
    listCategory,
    listBySearch,
    productPhoto,
    searchProduct
} = require('../functions/product')
const { requireLogin, isAuth, isAdmin } = require('../functions/auth')
const { userById } = require('../functions/user');

router.get("/product/:productId", getProduct)
router.post('/product/create/:userId', requireLogin, isAuth, createProduct);
router.delete('/product/:productId/:userId', requireLogin, isSeller, removeProduct);
router.put('/product/:productId/:userId', requireLogin, isSeller, updateProduct)

router.get('/products', listProduct);
router.get('/products/search', searchProduct)
router.get('/products/related/:productId', relatedList);
router.get('/products/categories', listCategory)
router.post('/products/by/search', listBySearch)
router.get('/product/photo/:productId', productPhoto);

router.param('userId', userById);
router.param('productId', productById);

module.exports = router;