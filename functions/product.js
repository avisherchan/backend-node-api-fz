const Product = require('../schemas/product');
const formidable = require('formidable');
const _ = require('lodash')
const fs = require('fs');
const product = require('../schemas/product');
const mongoose = require('mongoose');

exports.productById = (req, res, next, id) => {
    Product.findById(id)
    .populate('category')
    .populate('seller')
    .exec((err, product) => {
        if(err || !product) {
            return res.status(400).json({
                error: 'Product not found'
            })
        }
        req.product = product;
        next();
    })
}

exports.getProduct = (req, res) => {
    req.product.photo = undefined
    req.product.seller.hpass = undefined
    req.product.seller.salt = undefined
    return res.json(req.product);
}

exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            })
        }
        const {
            name, 
            description, 
            price, 
            category, 
            quantity, 
            shipping,
            condition,
            used,
            ownership,
            sim,
            screensize,
            os,
            bcam,
            fcam,
            cpu,
            ram,
            storage,
            features,
            darea,
            dfee,
            warranty,
            wtime,
            color,
            type,
            sizes,
            pyear,
            km,
            engine,
            gtrans,
            abags,
            msize,
            ssd,
            gcard,
            locatedAt,
            lsize,
            bedrooms,
            bathrooms,
            livingrooms,
            furnished,
            weight,
            batteries,
            comeswith,

        } = fields

        if(
            !name || 
            !description || 
            !price || 
            !category || 
            !quantity || 
            !shipping
            ) {
            return res.status(400).json({
                error: 'All fields are required'
            })
        }

        let product = new Product(fields)
        product.seller = req.profile;

        if(files.photo) {
            // console.log('FILES PHOTO: ', files.photo)
            if(files.photo.size > 100000) {
                return res.status(400).json({
                    error: 'Image should be less than 100kb in size. Please use a image compressor/resizer to decrease the size of your image.'
                });
            }

            if(files.photo.size === 0) {
                return res.status(400).json({
                    error: 'Please select an image'
                })
            }

            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }
        product.save((err, result) => {
            if(err) {
                return res.status(400).json({
                    error: err
                })
            }
            res.json(result)
        })
    })
};

exports.removeProduct = (req, res) => {
    let product = req.product
    product.remove((err, deletedProduct) => {
        if(err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json({
            message: 'Product deleted'
        })
    })
}

exports.isSeller = (req, res, next) => {
    let sameUser = req.product && req.auth && req.product.seller._id == req.auth._id;
    let adminUser = req.product && req.auth && req.auth.role === 1;

    console.log('req.product', req.product, "req.auth", req.auth)
    console.log('SAMEUSER: ', sameUser, "ADMINUSER: ", adminUser)

    let isSeller = sameUser || adminUser

    console.log("req.product: ", req.product);
    console.log("req.auth: ", req.auth);
    console.log("req.product.seller._id: ", req.product.seller._id);
    console.log("req.auth._id: ", req.auth._id);

    if(!isSeller) {
        return res.status(403).json({
            error: 'User is not authorized'
        })
    }
    next();
}

exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            })
        }
        const {
            name, 
            description, 
            price, 
            category, 
            quantity, 
            shipping
        } = fields

        let product = req.product
        product = _.extend(product, fields)
        product.seller = req.profile;

        if(files.photo) {
            // console.log('FILES PHOTO: ', files.photo)
            if(files.photo.size > 100000) {
                return res.status(400).json({
                    error: 'Image should be less than 00kb in size. Please use a image compressor/resizer to decrease the size of your image.'
                });
            }
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }
        product.save((err, result) => {
            if(err) {
                return res.status(400).json({
                    error: err
                })
            }
            res.json(result)
        })
    })
};

/**
 * sell = /products?sortBy=sold&order=desc&limit=4
 * arrival = /products?sortBy=createdAt&order=desc&limit=4
 */
exports.listProduct = (req, res) => {
    let order = req.query.order ? req.query.order : 'asc'
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
    let limit = req.query.limit ? parseInt(req.query.limit) : 20;

    Product.find()
        .select("-photo")
        .populate('category')
        .populate('seller', 'name')
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, data) => {
            if(err) {
                return res.status(400).json({
                    error: 'Products not found'
                })
            }
            res.send(data)
        })
}

/**
 * Finding the products based on the req product cateogory
 * based on that the products that are in the same category will be displayed
 */
exports.relatedList = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 20;

    Product.find({_id: {$ne: req.product}, category: req.product.category})
    .limit(limit)
    .populate('category', '_id name')
    .populate('seller', 'name')
    .exec((err, data) => {
        if(err) {
            return res.status(400).json({
                error: 'Products not found'
            })
        }
        res.json(data)
    })
}

exports.listCategory = (req, res) => {
    Product.distinct("category", {}, (err, data) => {
        if(err) {
            return res.status(400).json({
                error: 'Categories not found'
            });
        }
        res.json(data);
    })
}

/**
 * listing products by search method
 * product search will be available in the frontend
 * show categories in checkbox and price range in radio buttons
 * as the user clicks those buttons we will make a request 
 * and show the user the products that he searches
 */
exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : 'desc';
    let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if(key === "price") {
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .populate("seller", "name")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: 'Products not found'
                })
            }

            res.json({
                size: data.length,
                data
            });
        });
}

exports.productPhoto = (req, res, next) => {
    if(req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next();
}

exports.searchProduct = async (req, res) => {
    const query = {};

    if(req.query.search) {
        query.name = {
            $regex: req.query.search,
            $options: 'i'
        }

        if(req.query.category && req.query.category != 'All') {
            query.category = req.query.category;
        }
    }
    
    try {
        let products = await Product.find(query).select('-photo').populate('seller', 'name')
        res.json(products)
    } catch (error) {
        console.log(error);
        res.status(500).send('Could not find any products')
    }
}





















