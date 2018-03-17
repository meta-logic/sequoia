//api/routes/symbols.js
'use strict';

//Loading Dependencies =============================================
var express    = require('express');
var router     = express.Router();
var controller = require('../controllers/symbols');


//update symbols information
router.put('/symbols', controller.updateSymbols);


module.exports = router;