//server.js
'use strict';
const port = 3000


//Loading Dependencies =============================================
const https        = require('https');
const fs           = require('fs');
const express      = require('express');
const app          = express();
const passport     = require('passport')
const session      = require('express-session')
const flash        = require('express-flash')
const path         = require('path');
const helmet       = require('helmet');
const mongoose     = require('mongoose');
const morgan       = require('morgan');
const bodyParser   = require('body-parser');
const hbs          = require('express-handlebars');
const envm         = require('dotenv').config()


//loading local files ===============================================
const userRoutes     = require('./api/routes/user');
const calculusRoutes = require('./api/routes/calculus');
const ruleRoutes     = require('./api/routes/rule');
const symbolsRoutes  = require('./api/routes/symbols');
const database       = require('./config/db');
const sml_command    = require('./sml/smlCommands');
const initPassport   = require('./passport-config');
const userModel      = require('./api/models/user');
const calculusModel  = require('./api/models/calculus');
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
    secret: "process.env.SESSION_SECRET",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())


//connecting to mongo database 
mongoose.connect(database.local, {useNewUrlParser: true, useUnifiedTopology: true});


//Api Routers ===========================================================
app.use('/api', userRoutes);
app.use('/api', calculusRoutes);
app.use('/api', ruleRoutes);
app.use('/api', symbolsRoutes);


//Page Routes ===========================================================
app.get('/', checkNotAuthenticated, function (req, res) {
	return res.render('login/landing', {'layout' : 'landing'});
});

app.get('/home', checkAuthenticated, function (req, res) {
	return res.render('main/index', {'title' : 'Sequoia','layout' : 'main', 'user_id' : req.user._id, 'username' : req.user.username});
});

app.get('/login', function (req, res) {
	if (req.isAuthenticated()) {
		return res.redirect('/home')
	}
	if (req.flash('error').length > 0) {
		return res.render('login/fail', {'title' : 'Sequoia - login','layout' : 'login'});
	}
	return res.render('login/index', {'title' : 'Sequoia - login','layout' : 'login'});
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
	session: true,
	successRedirect: '/home',
	failureRedirect : '/login',
	failureFlash : true}
));

app.get('/logout', checkAuthenticated, function(req, res) {
	req.logout()
    res.redirect('/login')
});

app.get('/register', checkNotAuthenticated, function (req, res) {
	return res.render('login/register', {'title' : 'Sequoia - register','layout' : 'login'});
});

app.get('/calculus/:calc_id', checkAuthenticated, function (req, res) {
	return res.render('calculus/index', {'title' : 'Sequoia - calculus', 'layout' : 'calculus', 'calc_id' : req.params.calc_id});
});

app.get('/calculus/:calc_id/add-rule', checkAuthenticated, function (req, res) {
	return res.render('rule/index', {'title' : 'Sequoia - add rule', 'layout' : 'rule', 'calc_id' : req.params.calc_id,
						'page' : 'Add'});
});

app.get('/calculus/:calc_id/edit-rule/:rule_id', checkAuthenticated, function (req, res) {
	return res.render('rule/index', {'title' : 'Sequoia - edit rule', 'layout' : 'rule', 'calc_id' : req.params.calc_id, 
					'rule_id' : req.params.rule_id, 'page' : 'Update'});
});

app.get('/calculus/:calc_id/apply', checkAuthenticated, function (req, res) {
	return res.render('apply/index', {'title' : 'Sequoia - apply', 'layout' : 'apply', 'calc_id' : req.params.calc_id});
});

app.post('/apply', checkAuthenticated, function (req, res) {
	var result = sml_command.applyRule(req.body.rule, req.body.constraints, req.body.tree, req.body.node_id, req.body.index, req.body.subs, res);
});

app.get('/calculus/:calc_id/properties', checkAuthenticated, function (req, res) {
	return res.render('properties/index', {'title' : 'Sequoia - properties', 'layout' : 'properties', 'calc_id' : req.params.calc_id});
});

app.get('/calculus/:calc_id/properties/permutability', checkAuthenticated, function (req, res) {
	return res.render('properties/permutability', {'title' : 'Sequoia - properties', 'layout' : 'permutability', 'calc_id' : req.params.calc_id});
});

app.post('/permute', checkAuthenticated, function (req, res) {
	var result = sml_command.permuteRules(req.body.rule1, req.body.rule2, req.body.init_rules, req.body.wL, req.body.wR, res);
});

app.get('/calculus/:calc_id/properties/init_coherence', checkAuthenticated, function (req, res) {
	return res.render('properties/initcoherence', {'title' : 'Sequoia - properties', 'layout' : 'initcoherence', 'calc_id' : req.params.calc_id});
});

app.post('/initRules', checkAuthenticated, function (req, res) {
	var result = sml_command.initRules(req.body.first, req.body.second, req.body.third, res);
});

app.get('/calculus/:calc_id/properties/weak_admissability', checkAuthenticated, function (req, res) {
	return res.render('properties/weakadmiss', {'title' : 'Sequoia - properties', 'layout' : 'weakadmiss', 'calc_id' : req.params.calc_id});
});

app.post('/weakenSides', checkAuthenticated, function (req, res) {
	var result = sml_command.weakenSides(req.body.rules, res);
});

app.get('/calculus/:calc_id/properties/cut_admissability', checkAuthenticated, function (req, res) {
	return res.render('properties/cutadmiss', {'title' : 'Sequoia - properties', 'layout' : 'cutadmiss', 'calc_id' : req.params.calc_id});
});

app.post('/cutElim', checkAuthenticated, function (req, res) {
	var result = sml_command.cutElim(req.body.rule1, req.body.formula, req.body.init_rules, req.body.conn_rules, req.body.wL, req.body.wR, res);
});

function checkAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
		if (req.params.calc_id != null) {
			calculusModel.find({_id : req.params.calc_id, user : req.user._id}, function (err, calculus) {
				if (err || calculus.length == 0) {
					return res.status(403).json();
				} else {
					return next()
				}
			})
		} else {
			return next()
		}
    } else {
		res.redirect('/login')
	}
}

function checkNotAuthenticated (req, res, next) {
	if (!req.isAuthenticated()) {
		return next()
	}
	res.redirect('/login')
}


//intiating server ==================================================
app.listen(port);
// const httpsServer = https.createServer({
// 	key: fs.readFileSync('/afs/qatar.cmu.edu/course/15/logic/sequoia/certificates/logic.qatar.cmu.edu.key'),
// 	cert: fs.readFileSync('/afs/qatar.cmu.edu/course/15/logic/sequoia/certificates/logic.qatar.cmu.edu.cert'),
// 	ca: [fs.readFileSync('/afs/qatar.cmu.edu/course/15/logic/sequoia/certificates/intermediate_ca.cert')]
// }, app);
// httpsServer.listen(port, () => {console.log('HTTPS Server running on port 443');});
