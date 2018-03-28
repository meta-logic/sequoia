//routes/main/home.js
'use strict';

//Loading Dependencies =============================================
var express = require('express');
var router  = express.Router();
var sml     = require('../../sml/applyRule');

router.get('/apply', function (req, res) {
	return res.render('apply/index', {'title' : 'Sequoia - apply', 'layout' : 'apply'});
});


router.post('/apply', function (req, res) {
	var rule = req.body.rule;
	var sequent = req.body.sequent;
	var result = sml.applyRule(rule, sequent, res);
});

module.exports = router;