const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 40
    },
    description: {
        type: String,
        required: true,
        maxlength: 2000
    },
    price: {
        type: Number,
        trim: true,
        required: true,
    },
    category: {
        type: ObjectId,
        ref: 'Category',
        required: true,
    },
    quantity: {
        type: Number
    },
    sold: {
        type: Number,
        default: 0
    },
    photo: {
        data: Buffer,
        contentType: String,
    },
    seller: {
        type: ObjectId,
        ref: "User"
    },
    shipping: {
        type: String,
        required: true
    },
    condition: {
        type: String,
        required: false
    },
    used: {
        type: String,
        required: false
    },
    ownership: {
        type: String,
        required: false
    },
    sim: {
        type: String,
        required: false
    },
    screensize: {
        type: String,
        required: false
    },
    os: {
        type: String,
        required: false
    },
    bcam: {
        type: String,
        required: false
    },
    fcam: {
        type: String,
        required: false
    },
    cpu: {
        type: String,
        required: false
    },
    ram: {
        type: String,
        required: false
    },
    storage: {
        type: String,
        required: false
    },
    features: {
        type: String,
        required: false
    },
    darea: {
        type: String,
        required: false
    },
    dfee: {
        type: String,
        required: false
    },
    warranty: {
        type: String,
        required: false
    },
    wtime: {
        type: String,
        required: false
    },
    color: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: false
    },
    ftype: {
        type: String,
        required: false
    },
    sizes: {
        type: String,
        required: false
    },
    pyear: {
        type: String,
        required: false
    },
    km: {
        type: String,
        required: false
    },
    engine: {
        type: String,
        required: false
    },
    gtrans: {
        type: String,
        required: false
    },
    abags: {
        type: String,
        required: false
    },
    msize: {
        type: String,
        required: false
    },
    ssd: {
        type: String,
        required: false
    },
    gcard: {
        type: String,
        required: false
    },
    locatedAt: {
        type: String,
        required: false
    },
    lsize: {
        type: String,
        required: false
    },
    bedrooms: {
        type: String,
        required: false
    },
    bathrooms: {
        type: String,
        required: false
    },
    livingrooms: {
        type: String,
        required: false
    },
    furnished: {
        type: String,
        required: false
    },
    weight: {
        type: String,
        required: false
    },
    batteries: {
        type: String,
        required: false
    },
    comeswith: {
        type: String,
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema)  