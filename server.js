//server.js
'use strict';

//Loading Dependencies =============================================
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 3000;
var helmet   = require('helmet');
var path     = require('path');
var mongoose = require('mongoose');
var hbs      = require('express-handlebars');
var home_routes    = require('./routes/main/home');
var apply_routes   = require('./routes/main/apply');
var calculusRoutes = require('./api/routes/calculus');
var ruleRoutes     = require('./api/routes/rule');
var symbolsRoutes  = require('./api/routes/symbols');

// testing
var test_routes   = require('./routes/test/test');


var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');


//loading local files ===============================================
var database     = require('./config/db');
var Rule         = require('./api/models/rule');


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
app.use('/api', calculusRoutes);
app.use('/api', ruleRoutes);
app.use('/api', symbolsRoutes);
app.use('/', test_routes);
app.use('/', home_routes);
app.use('/', apply_routes);

app.get('/api/get-rules', function (req, res) {
	var rules = Rule.find({}, function (err, rules) {
		if (err) {
			console.log(err);
		}
		return res.json(rules);
	});

});

global.__basedir = __dirname;

//intiating server ==================================================
app.listen(port);
console.log("listening on port " + port);