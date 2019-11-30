//api/routes/user.js
"use strict"

//Loading Dependencies =============================================
var express    = require("express")
var router     = express.Router()
var controller = require("../controllers/user")


//user routes
router.post("/user", controller.createUser)
router.delete("/user", controller.deleteUser)
router.get("/user", controller.getUser)


module.exports = router
