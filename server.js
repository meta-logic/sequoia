// Sequoia Copyright (C) 2020  Zan Naeem, Abdulrahman Alfayad
// This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
// This is free software, and you are welcome to redistribute it
// under certain conditions; see LICENSE for details.


//server.js
'use strict';
const port = 8080


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
const favicon      = require('serve-favicon');


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
app.use('/sequoia/static', express.static(path.join(__dirname, '/public')));
app.use('/sequoia/bower', express.static(path.join(__dirname, '/bower_components')));


//Configurations =====================================================
app.use(favicon(__dirname + '/public/javascripts/sample_images/favicon.ico'));
app.use(helmet()); 
app.use(morgan('dev')); 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: false})); 
app.use(flash())
app.use(session({
    secret: "process.env.SESSION_SECRET",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())


//connecting to mongo database 
mongoose.connect(database.local, {useNewUrlParser: true, useUnifiedTopology: true });


//Api Routers ===========================================================
app.use('/sequoia/api', userRoutes);
app.use('/sequoia/api', calculusRoutes);
app.use('/sequoia/api', ruleRoutes);
app.use('/sequoia/api', symbolsRoutes);


//Page Routes ===========================================================
app.get('/sequoia', function(req, res) {
	if (req.isAuthenticated()) {
		return res.render('login/landing', {'title' : 'Sequoia', 'layout' : 'landing_in', 'page' : "in"});
	}
	return res.render('login/landing', {'title' : 'Sequoia', 'layout' : 'landing_out', 'page' : "out"});
});

app.get('/sequoia/home', checkAuthenticated, function(req, res) {
	return res.render('main/index', {'title' : 'Sequoia - home','layout' : 'main', 'user_id' : req.user._id, 'username' : req.user.username});
});

app.get('/sequoia/login', function(req, res) {
	if (req.isAuthenticated()) {
		return res.redirect('/sequoia/home')
	}
	if (req.flash('error').length > 0) {
		return res.render('login/index', {'title' : 'Sequoia - login','layout' : 'login', 'page' : "fail"});
	}
	return res.render('login/index', {'title' : 'Sequoia - login','layout' : 'login', 'page' : "normal"});
});

app.post('/sequoia/login', checkNotAuthenticated, passport.authenticate('local', {
	session: true,
	successRedirect: '/sequoia/home',
	failureRedirect : '/sequoia/login',
	failureFlash : true}
));

app.get('/sequoia/logout', checkAuthenticated, function(req, res) {
	fs.unlink(__dirname+"/tempProofs/"+req.user._id, function (err) {
		if (err) {
			console.log("File deletion request fail")
		} else {
			console.log("File deletion request successful")
		}
	})
	req.logout()
	res.redirect('/sequoia/login')
});

app.get('/sequoia/register', checkNotAuthenticated, function(req, res) {
	return res.render('login/register', {'title' : 'Sequoia - register','layout' : 'login'});
});

app.get('/sequoia/calculus/:calc_id', checkAuthenticated, function(req, res) {
	return res.render('calculus/index', {'title' : 'Sequoia - calculus', 'layout' : 'calculus', 'calc_id' : req.params.calc_id});
});

app.get('/sequoia/calculus/:calc_id/add-rule', checkAuthenticated, function(req, res) {
	return res.render('rule/index', {'title' : 'Sequoia - add rule', 'layout' : 'rule', 'calc_id' : req.params.calc_id,
						'page' : 'Add'});
});

app.get('/sequoia/calculus/:calc_id/edit-rule/:rule_id', checkAuthenticated, function(req, res) {
	return res.render('rule/index', {'title' : 'Sequoia - edit rule', 'layout' : 'rule', 'calc_id' : req.params.calc_id, 
					'rule_id' : req.params.rule_id, 'page' : 'Update'});
});

app.get('/sequoia/calculus/:calc_id/apply', checkAuthenticated, function(req, res) {
	return res.render('apply/index', {'title' : 'Sequoia - apply', 'layout' : 'apply', 'calc_id' : req.params.calc_id});
});

app.post('/sequoia/apply', checkAuthenticated, function(req, res) {
	var result = sml_command.applyRule(req.body.rule, req.body.constraints, req.body.tree, req.body.node_id, req.body.index, req.body.subs, res);
});

app.get('/sequoia/calculus/:calc_id/properties', checkAuthenticated, function(req, res) {
	return res.render('properties/index', {'title' : 'Sequoia - properties', 'layout' : 'properties', 'calc_id' : req.params.calc_id});
});

app.get('/sequoia/calculus/:calc_id/properties/init_coherence', checkAuthenticated, function(req, res) {
	return res.render('properties/initcoherence', {'title' : 'Sequoia - properties', 'layout' : 'initcoherence', 'calc_id' : req.params.calc_id});
});

app.post('/sequoia/initRules', checkAuthenticated, function(req, res) {
	var result = sml_command.initRules(req.body.first, req.body.second, req.body.third, res);
});

app.get('/sequoia/calculus/:calc_id/properties/weak_admissability', checkAuthenticated, function(req, res) {
	return res.render('properties/weakadmiss', {'title' : 'Sequoia - properties', 'layout' : 'weakadmiss', 'calc_id' : req.params.calc_id});
});

app.post('/sequoia/weakenSides', checkAuthenticated, function(req, res) {
	var result = sml_command.weakenSides(req.body.rules, res);
});

app.get('/sequoia/calculus/:calc_id/properties/permutability', checkAuthenticated, function(req, res) {
	return res.render('properties/permutability', {'title' : 'Sequoia - properties', 'layout' : 'permutability', 'calc_id' : req.params.calc_id});
});

app.post('/sequoia/permute', checkAuthenticated, function(req, res) {
	var result = sml_command.permuteRules(req.body.rule1, req.body.rule2, req.body.init_rules, req.body.wL, req.body.wR, res);
});

app.get('/sequoia/calculus/:calc_id/properties/cut_admissability', checkAuthenticated, function(req, res) {
	return res.render('properties/cutadmiss', {'title' : 'Sequoia - properties', 'layout' : 'cutadmiss', 'calc_id' : req.params.calc_id});
});

app.post('/sequoia/cutElim', checkAuthenticated, function(req, res) {
	var result = sml_command.cutElim(req.body.rule1, req.body.formula, req.body.init_rules, req.body.conn_rules, req.body.wL, req.body.wR, res);
});

app.get('/sequoia/calculus/:calc_id/properties/invertibility', checkAuthenticated, function(req, res) {
	return res.render('temporary/index', {'title' : 'Sequoia - properties', 'layout' : 'temporary'});
});

app.post('/sequoia/generate', checkAuthenticated, function(req, res) {
	var data = req.body.proof
	fs.writeFile("/tmp/"+req.user._id, data, function (err) {
		if (err) {
			res.status(400).send("Proof genereation request fail")
		} else {
			res.status(200).send("Proof genereation request successful")
		}
	})
});

app.get('/sequoia/fetch/:property', checkAuthenticated, function(req, res) {
	var fileName = req.params.property
	res.set({"Content-Disposition":"attachment; filename=\""+fileName+".tex\""});
	res.sendFile("/tmp/"+req.user._id, function (err) {
		if (err) {
			console.log(err)
		} else {
			console.log('File sent.')
		}
	})
});

app.post('/sequoia/remove/', checkAuthenticated, function(req, res) {
	fs.unlink("/tmp/"+req.user._id, function (err) {
		if (err) {
			res.status(200).send("File deletion request fail")
		} else {
			res.status(200).send("File deletion request successful")
		}
	})
});

function checkAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
		if (req.params.calc_id != null) {
			calculusModel.find({_id : req.params.calc_id, user : req.user._id}, function(err, calculus) {
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
		res.redirect('/sequoia/login')
	}
}

function checkNotAuthenticated (req, res, next) {
	if (!req.isAuthenticated()) {
		return next()
	}
	res.redirect('/sequoia/login')
}


//intiating server ==================================================
app.listen(port);
