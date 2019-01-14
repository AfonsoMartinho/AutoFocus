const express = require('express');
const app = express();
//Morgan package auto logs all the request made to the API
const morgan = require('morgan');
//Easely parse Json Data
const bodyParser = require('body-parser');
//MOngoose
const mongoose = require('mongoose');

const activityRoutes = require('./api/routes/activities');
const userRoutes = require('./api/routes/users');
const fs= require('fs');

//The Root URL Of Project
module.exports.Root = 'http://localhost:3000/';

//Conectin With MongoDB
//+process.env.MONGO_ATLAS_PW +insted of the hardcoded password PLZ REPLACE
mongoose.connect(
    'mongodb+srv://afonso:' +
    process.env.MONGO_ATLAS_PW +
    '@amdevlops-bkp3t.gcp.mongodb.net/test?retryWrites=true', {
        useNewUrlParser: true
    }
);

//Avoid Deprecation Warnings
mongoose.Promise = global.Promise;

//Useful midlewares
app.use(morgan('dev'));
app.use(express.static('uploads'))
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//CORs handling and preventing CORS ERRORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-control-allow-headers',
        'Origin, X-Requested-With,Content-Type,Accept,Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Alow-Methods', 'PUT', 'POST', 'PATCH', 'DELETE', 'GET')
        return res.status(200).json({});
    }
    next();
});

//Routes
app.use('/activities', activityRoutes);
app.use('/users', userRoutes);

//Handling HTM files
app.use((req, res, next) => {
    res.writeHead(200,{'Content-Type':'text/html'});
    var myReadStream = fs.createReadStream('index.html','utf8');
    myReadStream.pipe(res);
});

//Errors 404
app.use((req, res, next) => {
    const error = new Error('not found');
    error.status = 404;
    next(error);
});
//Other Errors
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});


module.exports = app