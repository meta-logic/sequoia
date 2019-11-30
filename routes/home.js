//routes/main/home.js
'use strict';

//Loading Dependencies =============================================
var express    = require('express');
var router     = express.Router();
var sml_apply        = require('../sml/applyRule');
var sml_permute      = require('../sml/permuteRules');


router.get('/', function (req, res) {
	return res.render('main/index', {'title' : 'Sequoia','layout' : 'main'});
});

router.get('/login', function (req, res) {
	return res.render('login/index', {'title' : 'Sequoia - login','layout' : 'login'});
});

router.get('/register', function (req, res) {
	return res.render('login/register', {'title' : 'Sequoia - register','layout' : 'login'});
});

router.get('/calculus/:calc_id', function (req, res) {
	return res.render('calculus/index', {'title' : 'Sequoia - calculus', 'layout' : 'calculus', 'calc_id' : req.params.calc_id});
});

router.get('/calculus/:calc_id/add-rule', function (req, res) {
	return res.render('rule/index', {'title' : 'Sequoia - add rule', 'layout' : 'rule', 'calc_id' : req.params.calc_id,
						'page' : 'add'});
});

router.get('/calculus/:calc_id/edit-rule/:rule_id', function (req, res) {
	return res.render('rule/index', {'title' : 'Sequoia - edit rule', 'layout' : 'rule', 'calc_id' : req.params.calc_id, 
					'rule_id' : req.params.rule_id, 'page' : 'edit'});
});

router.get('/calculus/:calc_id/apply', function (req, res) {
	return res.render('apply/index', {'title' : 'Sequoia - apply', 'layout' : 'apply', 'calc_id' : req.params.calc_id});
});

router.post('/apply', function (req, res) {
	var result = sml_apply.applyRule(req.body.rule, req.body.tree, req.body.node_id, res);
});

router.get('/calculus/:calc_id/properties', function (req, res) {
	return res.render('properties/index', {'title' : 'Sequoia - properties', 'layout' : 'properties', 'calc_id' : req.params.calc_id});
});

router.get('/calculus/:calc_id/properties/permutability', function (req, res) {
	return res.render('properties/permutability', {'title' : 'Sequoia - properties', 'layout' : 'permutability', 'calc_id' : req.params.calc_id});
});

router.post('/permute', function (req, res) {
	var result = sml_permute.permuteRules(req.body.rule1, req.body.rule2, req.body.init_rules, res);
});

router.get('/calculus/:calc_id/properties/init_coherence', function (req, res) {
	return res.render('properties/initcoherence', {'title' : 'Sequoia - properties', 'layout' : 'initcoherence', 'calc_id' : req.params.calc_id});
});

router.get('/calculus/:calc_id/properties/weak_admissability', function (req, res) {
	return res.render('properties/weakadmiss', {'title' : 'Sequoia - properties', 'layout' : 'weakadmiss', 'calc_id' : req.params.calc_id});
});

router.post('/weakenSides', function (req, res) {
	var result = sml_permute.weakenSides(req.body.rules, res);
});

module.exports = router;