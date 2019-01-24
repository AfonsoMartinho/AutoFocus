const express = require('express');
const app = express();
//Morgan package auto logs all the request made to the API
const morgan = require('morgan');
//Easely parse Json Data
const bodyParser = require('body-parser');
//MOngoose
const mongoose = require('mongoose');
const path = require('path');

const activityRoutes = require('./api/routes/activities');
const userRoutes = require('./api/routes/users');
const fs = require('fs');
const cookieParser = require('cookie-parser');
//EJS Layouts
const expressLayouts = require('express-ejs-layouts');
//Call api
const apiCall = require('./apiCall');

const dirname = "C:/Users/Afonso/Documents/Dev/Portfolio/AutoFocus/";


//The Root URL Of Project
module.exports.Root = 'http://localhost:3000/';


//Conectin With MongoDB
//+process.env.MONGO_ATLAS_PW +insted of the hardcoded password PLZ REPLACE
mongoose.connect(
    'mongodb+srv://afonso:' +
    process.env.MONGO_ATLAS_PW +
    '@amdevlops-bkp3t.gcp.mongodb.net/AutoFocus?retryWrites=true', {
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
app.use(cookieParser());
app.use(express.static(path.join(dirname, 'assets')));

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

//EJS
app.use(expressLayouts);
app.set('views', path.join(dirname, 'views'));
app.set('view engine', 'ejs');
//iNDEX pAGE RENDER
app.get('/', function (req, res) {
    apiCall.getAll().then(response=>{
        const users = response.users;
        const activities = response.activities;
        res.render('index', {
            users: users,
            activities: activities
        });
    });
});
app.get('/signUp', function (req, res) {
    apiCall.getAll().then(response=>{
        const users = response.users;
        const activities = response.activities;
        res.render('signUp', {
            users: users,
            activities: activities
        });
    });
});

app.get('/logIn', function (req, res) {
    apiCall.getAll().then(response=>{
        const users = response.users;
        const activities = response.activities;
        res.render('logIn', {
            users: users,
            activities: activities
        });
    });
});

//About page render
app.get('/about', function (req, res) {
    res.render('about');
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