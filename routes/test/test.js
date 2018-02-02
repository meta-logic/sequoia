//routes/test/test.js
'use strict';

//Loading Dependencies =============================================
var express = require('express');
var router  = express.Router();

router.get('/test', function (req, res) {
	return res.render('test/test', {'title' : 'Sequoia - apply', 'layout' : 'test'});
});

module.exports = router;