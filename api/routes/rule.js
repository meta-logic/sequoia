// Sequoia Copyright (C) 2020  Zan Naeem, Abdulrahman Alfayad
// This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
// This is free software, and you are welcome to redistribute it
// under certain conditions; see LICENSE for details.


//Loading Dependencies =============================================
var express    = require("express")
var router     = express.Router()
var controller = require("../controllers/rule")


//rule routes
router.post("/rule", controller.createRule)
router.post("/rules_init", controller.createRules)
router.put("/rule", controller.updateRule)
router.delete("/rule", controller.deleteRule)
router.get("/rule/:rule_id", controller.getRule)
router.get("/rules/:calc_id", controller.getRules)


module.exports = router
