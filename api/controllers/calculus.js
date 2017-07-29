//api/controllers/calculus
'use strict';

//Loading Dependencies =============================================
var Calculus = require('../models/calculus');


//creating a calculus
function createCalculus (req, res) {
	var calculus = new Calculus();

	//populating the calculus model with the rules from the reuest body
	calculus.rules = JSON.parse(req.body.rules);

	//saving the calculus in the database
	calculus.save(function (err) {

		//if something went wrong while saving, return the error
		if (err) {
			return res.status(400).json({
				'status'  : 'failure',
				'message' : 'something went wrong while creating the calculus'
			});
		}

		//send success message and created calculus
		return res.status(200).json({
			'status'     : 'success',
			'message'    : 'calculus was created',
			'calculus'   : calculus   
		});
	}); 
}

//fetching a calculus
function getCalculus (req, res) {
	//looking up the calculus
	Calculus.findById(req.params.id, function (err, calculus) {

		//if the calculus does not exist
		if (err || calculus == null) {
			return res.status(400).json({
				'status'  : 'failure',
				'message' : 'calculus does not exist'
			});
		}

		//return the calculus 
		return res.status(200).json({
			'status'    : 'success',
			'calculus'  : calculus
		});
	});
}


//updating a calculus
function updateCalculus (req, res) {
	//looking up the calculus and updating it
	Calculus.findOneAndUpdate({ _id : req.params.id}, { rules : req.body.rules }, { new : true}, 
		function (err, calculus) {
			//if the calculus does not exist
			if (err || calculus == null) {
				return res.status(400).json({
					'status'  : 'failure',
					'message' : 'calculus does not exist'
				});
			}

		//send back the updated calculus 
		return res.status(200).json({
			'status'    : 'success',
			'calculus'  : calculus
		});
	});
}


//deleting a calculus
function deleteCalculus (req, res) {
	//deleting a calculus
	Calculus.remove({ _id : req.params.id}, function (err, calculus) {
		//if the calculus does not exist
		if (err || calculus == null) {
			return res.status(400).json({
				'status'  : 'failure',
				'message' : 'calculus does not exist'
			});
		}
 
		//calculus deleted
		return res.status(200).json({
			'status'  : 'success',
			'message' : 'calculus successfully deleted'
		});
	});
}


module.exports = {createCalculus, getCalculus, updateCalculus, deleteCalculus};