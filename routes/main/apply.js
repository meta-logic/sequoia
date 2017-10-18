//routes/main/home.js
'use strict';

//Loading Dependencies =============================================
var express = require('express');
var router  = express.Router();

router.get('/apply', function (req, res) {
	return res.render('apply/index', {'title' : 'Sequoia - apply', 'layout' : 'apply'});
});

module.exports = router;