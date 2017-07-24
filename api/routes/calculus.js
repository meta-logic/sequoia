//api/routes/calculus.js
'use strict';

//Loading Dependencies =============================================
var express    = require('express');
var router     = express.Router();
var controller = require('../controllers/calculus');


//calculus
router.route('/calculus')

	//creating a calculus
	.post(controller.createCalculus)

	//get calculus information
	.get(controller.getCalculus)

	//update calculus information
	.put(controller.updateCalculus)

	//delete a calculus
	.delete(controller.deleteCalculus);


module.exports = router;