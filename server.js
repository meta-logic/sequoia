//server.js
'use strict';

//Loading Dependencies =============================================
require('dotenv').config()
var express      = require('express');
var app = express();
var passport     = require('passport')
var session      = require('express-session')
var flash        = require('express-flash')
var path         = require('path');
var helmet       = require('helmet');
var mongoose     = require('mongoose');
var morgan       = require('morgan');
var bodyParser   = require('body-parser');
var hbs          = require('express-handlebars');


//loading local files ===============================================
var userRoutes     = require('./api/routes/user');
var calculusRoutes = require('./api/routes/calculus');
var ruleRoutes     = require('./api/routes/rule');
var symbolsRoutes  = require('./api/routes/symbols');
var database       = require('./config/db');
var sml_apply      = require('./sml/applyRule');
var sml_permute    = require('./sml/permuteRules');
var sml_weaken     = require('./sml/weakenSides');
var sml_init       = require('./sml/initCohRules');
var initPassport   = require('./passport-config');
var userModel      = require('./api/models/user');
var calculusModel  = require('./api/models/calculus');
initPassport(passport, userModel)


// view engine setup
app.engine('hbs', hbs({defaultLayout : 'layout', extname : '.hbs'}))
app.set('view engine', 'hbs');


// public folder path setup
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/bower', express.static(path.join(__dirname, 'bower_components')));


//Configurations =====================================================
app.use(helmet()); // configuring headers to be secure
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({extended: false})); // get information from html forms
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())


//connecting to mongo database 
mongoose.connect(database.local, {useNewUrlParser: true});


//Api Routers ===========================================================
app.use('/api', userRoutes);
app.use('/api', calculusRoutes);
app.use('/api', ruleRoutes);
app.use('/api', symbolsRoutes);




//Page Routes ===========================================================
app.get('/', checkAuthenticated, function (req, res) {
	return res.render('main/index', {'title' : 'Sequoia','layout' : 'main', 'user_id' : req.user._id, 'username' : req.user.username});
});

app.get('/login', function (req, res) {
	if (req.isAuthenticated()) {
		return res.redirect('/')
	}
	if (req.flash('error').length > 0) {
		return res.render('login/fail', {'title' : 'Sequoia - login','layout' : 'login'});
	}
	return res.render('login/index', {'title' : 'Sequoia - login','layout' : 'login'});
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
	session: true,
	successRedirect: '/',
	failureRedirect : '/login',
	failureFlash : true}
));

app.get('/logout', checkAuthenticated, function(req, res) {
	req.logout()
    res.redirect('/login')
});

app.get('/register', function (req, res) {
	return res.render('login/register', {'title' : 'Sequoia - register','layout' : 'login'});
});

app.get('/calculus/:calc_id', checkAuthenticated, function (req, res) {
	return res.render('calculus/index', {'title' : 'Sequoia - calculus', 'layout' : 'calculus', 'calc_id' : req.params.calc_id});
});

app.get('/calculus/:calc_id/add-rule', checkAuthenticated, function (req, res) {
	return res.render('rule/index', {'title' : 'Sequoia - add rule', 'layout' : 'rule', 'calc_id' : req.params.calc_id,
						'page' : 'add'});
});

app.get('/calculus/:calc_id/edit-rule/:rule_id', checkAuthenticated, function (req, res) {
	return res.render('rule/index', {'title' : 'Sequoia - edit rule', 'layout' : 'rule', 'calc_id' : req.params.calc_id, 
					'rule_id' : req.params.rule_id, 'page' : 'edit'});
});

app.get('/calculus/:calc_id/apply', checkAuthenticated, function (req, res) {
	return res.render('apply/index', {'title' : 'Sequoia - apply', 'layout' : 'apply', 'calc_id' : req.params.calc_id});
});

app.post('/apply', checkAuthenticated, function (req, res) {
	var result = sml_apply.applyRule(req.body.rule, req.body.tree, req.body.node_id, req.body.index, res);
});

app.get('/calculus/:calc_id/properties', checkAuthenticated, function (req, res) {
	return res.render('properties/index', {'title' : 'Sequoia - properties', 'layout' : 'properties', 'calc_id' : req.params.calc_id});
});

app.get('/calculus/:calc_id/properties/permutability', checkAuthenticated, function (req, res) {
	return res.render('properties/permutability', {'title' : 'Sequoia - properties', 'layout' : 'permutability', 'calc_id' : req.params.calc_id});
});

app.post('/permute', checkAuthenticated, function (req, res) {
	var result = sml_permute.permuteRules(req.body.rule1, req.body.rule2, req.body.init_rules, res);
});

app.get('/calculus/:calc_id/properties/init_coherence', checkAuthenticated, function (req, res) {
	return res.render('properties/initcoherence', {'title' : 'Sequoia - properties', 'layout' : 'initcoherence', 'calc_id' : req.params.calc_id});
});

app.post('/initRules', checkAuthenticated, function (req, res) {
	var result = sml_init.initRules(req.body.first, req.body.second, req.body.third, res);
});

app.get('/calculus/:calc_id/properties/weak_admissability', checkAuthenticated, function (req, res) {
	return res.render('properties/weakadmiss', {'title' : 'Sequoia - properties', 'layout' : 'weakadmiss', 'calc_id' : req.params.calc_id});
});

app.post('/weakenSides', checkAuthenticated, function (req, res) {
	var result = sml_weaken.weakenSides(req.body.rules, res);
});

app.get('/calculus/:calc_id/properties/cut_admissability', checkAuthenticated, function (req, res) {
	return res.render('temporary/index', {'title' : 'Sequoia', 'layout' : 'temporary'});
});

function checkAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
		if (req.params.calc_id != null) {
			calculusModel.find({_id : req.params.calc_id, user : req.user._id}, function (err, calculus) {
				if (err || calculus.length == 0) {
					console.log("yo")
					return res.status(403).json();
				}
			})
		}
        return next()
    }
    res.redirect('/login')
}

function checkNotAuthenticated (req, res, next) {
	if (!req.isAuthenticated()) {
		return next()
	}
	res.redirect('/login')
}


//intiating server ==================================================
app.listen(3000);