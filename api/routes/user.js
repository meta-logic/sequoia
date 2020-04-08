// Sequoia Copyright (C) 2020  Zan Naeem
// This program comes with ABSOLUTELY NO WARRANTY; for details type `show w'.
// This is free software, and you are welcome to redistribute it
// under certain conditions; type `show c' for details.


//Loading Dependencies =============================================
var express    = require("express")
var router     = express.Router()
var controller = require("../controllers/user")


//user routes
router.post("/user", controller.createUser)
router.delete("/user", controller.deleteUser)
router.get("/user/:user_id", controller.getUser)
router.get("/users/:username", controller.checkUser)


module.exports = router
