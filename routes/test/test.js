//routes/test/test.js
'use strict';

//Loading Dependencies =============================================
var express = require('express');
var router  = express.Router();
var sml     = require('../../sml/writeRule');

router.get('/test', function (req, res) {
	return res.render('test/test', {'title' : 'Sequoia - apply', 'layout' : 'test'});
});

router.post('/test', function (req, res) {
	sml.writeRule(req.body.rule, req.body.conclusion, JSON.parse(req.body.premises), JSON.parse(req.body.conc), JSON.parse(req.body.prem));
	return;
});

module.exports = router;