//routes/main/home.js
'use strict';

//Loading Dependencies =============================================
var express = require('express');
var router  = express.Router();
var sml     = require('../../sml/applyRule');


router.post('/apply', function (req, res) {
	var rule = req.body.rule;
	var tree = req.body.tree;
	var id = req.body.node_id;
	var result = sml.applyRule(rule, tree, id, res);
});


module.exports = router;