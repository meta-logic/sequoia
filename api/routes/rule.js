//api/routes/rule.js
'use strict';

//Loading Dependencies =============================================
var express    = require('express');
var router     = express.Router();
var controller = require('../controllers/rule');


//rule
router.route('/rule')

	//creating a rule
	.post(function(req, res) {
          console.log("***** ROUTES: post *****");
          controller.createRule(req. res);
        })

	//update rule information
	.put(function(req, res) {
          console.log("***** ROUTES: put *****");
          controller.updateRule(req, res);
        })

	//delete a rule
	.delete(function(req, res) {
          console.log("***** ROUTES: delete *****");
          controller.deleteRule(req, res);
        });

//get rule information
router.get('/rule/:id', controller.getRule);

module.exports = router;
