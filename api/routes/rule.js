//api/routes/rule.js
'use strict';

//Loading Dependencies =============================================
var express    = require('express');
var router     = express.Router();
var controller = require('../controllers/rule');


//rule
router.route('/rule')

	//creating a rule
	.post(controller.createRule)

	//update rule information
	.put(controller.updateRule)

	//delete a rule
	.delete(controller.deleteRule);

//get rule information
router.get('/rule/:id', controller.getRule);

module.exports = router;