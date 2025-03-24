let express = require('express');
let userService = require("../services/userService.js");
const logout = require('../middleware/logoutMiddleware.js');
const router = express.Router();
const checkUserAuth = require("../middleware/authMiddleware.js")

//& Route Level Middleware - To Protect Route
router.use("/logout", logout);


//& Protected Routes
router.delete("/users/:deleteUserId", checkUserAuth, userService.deleteUserById);
router.get("/users", checkUserAuth, userService.users);

// * pubic routes
router.post("/login", userService.login);
router.post("/registration", userService.registration);
router.get("/users/:userId", userService.getUserDetailById);
router.get("/captcha", userService.captcha);


module.exports = router