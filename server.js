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
// var treeRoutes     = require('./api/routes/prooftree');

// testing
// var test_routes   = require('./routes/test/test');


var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');


//loading local files ===============================================
var database     = require('./config/db');
var Rule         = require('./api/models/rule');
var Symbols      = require('./api/models/symbols');
var Calcs      = require('./api/models/calculus');
// var ProofTree    = require('./api/models/prooftree');


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
// app.use('/api', treeRoutes);
// app.use('/', test_routes);
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

app.get('/api/get-symbols', function (req, res) {
	var symbols = Symbols.find({group : "rule"}, function (err, symbols) {
		if (err) {
			console.log(err);
		}
		return res.json(symbols);
	});
});

app.get('/api/get-seq_symbols', function (req, res) {
	var symbols = Symbols.find({group : "seq"}, function (err, symbols) {
		if (err) {
			console.log(err);
		}
		return res.json(symbols);
	});
});

app.get('/api/get-certain_symbols', function (req, res) {
	var symbols = Symbols.find({$or:[{group: "seq"},{type : {$in: ["connective", "sequent sign", "context separator", "empty"]}}]}, 
	function (err, symbols) {
		if (err) {
			console.log(err);
		}
		return res.json(symbols);
	});
});

app.get('/api/get-calculi', function (req, res) {
	var calcs = Calcs.find({}, function (err, calcs) {
		if (err) {
			console.log(err);
		}
		return res.json(calcs);
	});
});

// app.get('/api/get-prooftree', function (req, res) {
// 	var tree = ProofTree.find({}, function (err, tree) {
// 		if (err) {
// 			console.log(err);
// 		}
// 		return res.json(tree);
// 	});

// });

global.__basedir = __dirname;

//intiating server ==================================================
app.listen(port);
console.log("listening on port " + port);
