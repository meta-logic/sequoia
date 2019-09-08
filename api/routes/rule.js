//api/routes/rule.js
"use strict"

//Loading Dependencies =============================================
var express    = require("express")
var router     = express.Router()
var controller = require("../controllers/rule")


//rule routes
router.post("/rule", controller.createRule)
router.put("/rule", controller.updateRule)
router.delete("/rule", controller.deleteRule)
router.get("/rule/:id", controller.getRule)


module.exports = router
