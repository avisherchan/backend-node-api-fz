const { kebabCase } = require('lodash');
const Category = require('../schemas/category');

exports.categoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if(err || !category) {
            return res.status(400).json({
                error: 'Category does not exists'
            })
        }
        req.category = category;
        next();
    })
}

exports.create = (req, res) => {
    const category = new Category(req.body)
    category.save((err, data) => {
        if(err) {
            return res.status(400).json({
                error: 'You are not authorized! Access denied.'
            })
        }
        res.json({ data })
    })
}

exports.getCategory = (req, res) => {
    return res.json(req.category);
}

exports.updateCategory = (req, res) => {
    const category = req.category;
    category.name = req.body.name
    category.save((err, data) => {
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json(data)
    });
};

exports.removeCategory = (req, res) => {
    const category = req.category;
    category.remove((err, data) => {
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json({
            message: 'Category deleted'
        });
    });
};

exports.list = (req, res) => {
    Category.find().exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json(data)
    })
};