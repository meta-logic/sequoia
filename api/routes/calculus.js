// Sequoia Copyright (C) 2020  Zan Naeem
// This program comes with ABSOLUTELY NO WARRANTY; for details type `show w'.
// This is free software, and you are welcome to redistribute it
// under certain conditions; type `show c' for details.


//Loading Dependencies =============================================
var express    = require("express")
var router     = express.Router()
var controller = require("../controllers/calculus")


//calculus routes
router.post("/calculus", controller.createCalculus)
router.delete("/calculus", controller.deleteCalculus)
router.get("/calculus/:calc_id", controller.getCalculus)
router.get("/calculi/:user_id", controller.getCalculi)


module.exports = router