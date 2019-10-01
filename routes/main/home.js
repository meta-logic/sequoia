//routes/main/home.js
'use strict';

//Loading Dependencies =============================================
var express    = require('express');
var router     = express.Router();
var Calculus   = require('../../api/models/calculus');
var Rule       = require('../../api/models/rule');




function getRule (rules) {
	if (rules.length > 0) {
		Rule.findById(req.params.id, function (err, rule) {

			//if the rule does not exist
			if (err || rule == null) {
				return {premises : ["error"], conclusion : "error", rule : "error"};
			}

			//return the rule 
			return {premises : rule.premises[0].split(','), conclusion : rule.conclusion, rule : rule.rule};
		});
	}

	return [];
}

function calculusTemplate () {
	var calculuses = getCalculuses();
	var calc = []; 
	var rule;
	console.log(calculuses);
	if (calculuses) {
		for (var i = 0; i < calculuses.length; i++) {
			rule = getRule(calculuses[i]);
			calc.push({id : i, _id : calculuses[i]._id, title : calculuses[i].title, description : calculuses[i].description, premises : rule.premises, conclusion : rule.conclusion, rule : rule.rule});
		}
	}
}

router.get('/calculus', function (req, res) {
	Calculus.find({}, function (err, calculuses) {
		if (err) {
			console.log(err);
		}
		var calc = []; 
		var rule;
		console.log(calculuses);

		for (var i = 0; i < calculuses.length; i++) {
			rule = getRule(calculuses[i]);
			calc.push({id : i, _id : calculuses[i]._id, title : calculuses[i].title, description : calculuses[i].description, premises : rule.premises, conclusion : rule.conclusion, rule : rule.rule});
		}
		return res.render('calculus/index', { 'calculus' : calc, 'title' : 'Sequoia - calculus', 'layout' : 'all-calculus'});

	});

});

router.get('/add-rule', function (req, res) {
	return res.render('rule/index', {'title' : 'Sequoia - add rule', 'layout' : 'rule'});
});

router.get('/all-calculi', function (req, res) {
	return res.render('calculus/index', {'title' : 'Sequoia - add calculus', 'layout' : 'all-calculi'});
});

router.get('/edit-rule/:id', function (req, res) {
	return res.render('rule/edit', {'title' : 'Sequoia - edit rule', 'layout' : 'edit', 'id' : req.params.id });
});

router.get('/translate', function (req, res) {
	return res.render('linear-logic/index', {'title' : 'Sequoia - translate', 'layout' : 'translate'});
});

router.get('/apply', function (req, res) {
	return res.render('apply/index', {'title' : 'Sequoia - apply', 'layout' : 'apply'});
});

router.get('/', function (req, res) {
	return res.render('main/index', {'title' : 'Sequoia','layout' : 'calculus'});
});

module.exports = router;