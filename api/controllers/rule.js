//api/controllers/rule
'use strict';

//Loading Dependencies =============================================
var Rule = require('../models/rule');
var sml     = require('../../sml/writeRule');

//helper functions for extraArguents

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

function extraArguments(conclusion_list, premises_list) {

	var arguments = [];

	for (var i = 0; i < premises_list.length; i++) {
		arguments.push(premises_list[i].diff(conclusion_list));
	}

	arguments = flatten(arguments);
	return Array.from(new Set(arguments));

}

//creating a rule
function createRule (req, res) {
	var rule = new Rule();

	//populating the rule model with sequents and their connectives
	rule.rule      = req.body.rule;
	rule.premises  = JSON.parse(req.body.premises);
	rule.conclusion = req.body.conclusion;
	rule.extraArguments = extraArguments(JSON.parse(req.body.conc), JSON.parse(req.body.prem));

	console.log(rule);

	//saving the rule in the database
	rule.save(function (err) {

		//if something went wrong while saving, return the error
		if (err) {
			return res.status(400).json({
				'status'  : 'failure',
				'message' : 'something went wrong while creating the rule'
			});
		}

		sml.writeRule(rule.rule, req.body.parsed_conc, JSON.parse(req.body.parsed_prem), rule.extraArguments);

		//send success message and created rule
		return res.status(200).json({
			'status'  : 'success',
			'message' : 'rule was created',
			'rule'    : rule   
		});
	}); 
}


//fetching a rule
function getRule (req, res) {
	//looking up the rule
	console.log(req.params.id);
	Rule.findById(req.params.id, function (err, rule) {

		//if the rule does not exist
		if (err || rule == null) {
			return res.status(400).json({
				'status'  : 'failure',
				'message' : 'rule does not exist'
			});
		}

		//return the rule 
		return res.status(200).json({
			'status' : 'success',
			'rule'   : rule
		});
	});
}


//updating a rule
function updateRule (req, res) {
	var extraArguments = extraArguments(JSON.parse(req.body.conc), JSON.parse(req.body.prem));

	//looking up the rule and updating it
	Rule.findOneAndUpdate({ _id : req.body.id}, 
		{ rule : req.body.rule, premises : JSON.parse(req.body.premises), 
		  conlusion : req.body.conclusion, extraArguments : extraArguments}, { new : true}, 
		function (err, rule) {
			//if the rule does not exist
			if (err || rule == null) {
				return res.status(400).json({
					'status'  : 'failure',
					'message' : 'rule does not exist'
				});
			}

		sml.writeRule(req.body.rule, req.body.parsed_conc, JSON.parse(req.body.parsed_prem), extraArguments);

		//send back the updated rule 
		return res.status(200).json({
			'status' : 'success',
			'rule'   : rule
		});
	});
}


//deleting a rule
function deleteRule (req, res) {
	//deleting a rule
	Rule.remove({ _id : req.body.id}, function (err, rule) {
		//if the rule does not exists
		if (err || rule == null) {
			return res.status(400).json({
				'status'  : 'failure',
				'message' : 'rule does not exist'
			});
		}
 
		//rule deleted
		return res.status(200).json({
			'status'  : 'success',
			'message' : 'rule successfully deleted',
			'rule'    : rule
		});
	});
}


module.exports = {createRule, getRule, updateRule, deleteRule};