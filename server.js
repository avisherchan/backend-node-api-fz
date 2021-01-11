// imports
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config()
const expressValidator = require('express-validator');

// configuration
const app = express();
const port = process.env.PORT || 8080;
const conn_url = 'mongodb+srv://avi:ivzBxRLKckcPqKWl@cluster0.emx8g.mongodb.net/DB?retryWrites=true&w=majority'

// middlewares
app.use(cors());
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser());
app.use(expressValidator())

// db
mongoose.connect(conn_url, {
    useNewUrlParser: true,
    useCreateIndex: true,
}).then(() => console.log(`DB CONNECTED`));


// routes imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const messageRoutes = require('./routes/messageRoutes');

// routes
app.use('/', authRoutes)
app.use('/', userRoutes)
app.use('/', categoryRoutes)
app.use('/', productRoutes)

// listen
app.listen(port, () => {
    console.log(`Running server in port: ${port}`)
})