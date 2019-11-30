//server.js
'use strict';

//Loading Dependencies =============================================
var express      = require('express');
var path         = require('path');
var helmet       = require('helmet');
var mongoose     = require('mongoose');
var morgan       = require('morgan');
var bodyParser   = require('body-parser');
var hbs          = require('express-handlebars');
var cookieParser = require('cookie-parser');
var app = express();
var port = 3000;


//loading local files ===============================================
var page_routes    = require('./routes/home');
var userRoutes = require('./api/routes/user');
var calculusRoutes = require('./api/routes/calculus');
var ruleRoutes     = require('./api/routes/rule');
var symbolsRoutes  = require('./api/routes/symbols');
var database       = require('./config/db');


//Configurations =====================================================
app.use(helmet()); // configuring headers to be secure
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({extended: false})); // get information from html forms



// view engine setup
app.engine('hbs', hbs({defaultLayout : 'layout', extname : '.hbs'}))
app.set('view engine', 'hbs');

// public folder path setup
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/bower', express.static(path.join(__dirname, 'bower_components')));


//connecting to mongo database 
mongoose.connect(database.local, {useNewUrlParser: true});


//Routers ===========================================================
app.use('/api', userRoutes);
app.use('/api', calculusRoutes);
app.use('/api', ruleRoutes);
app.use('/api', symbolsRoutes);
app.use('/', page_routes);


global.__basedir = __dirname;

//intiating server ==================================================
app.listen(port);
console.log("listening on port " + port);
