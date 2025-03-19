let express = require('express');
let userService = require("../services/userService.js");
const logout = require('../middleware/logoutMiddleware.js');
const router = express.Router();

//& Route Level Middleware - To Protect Route
router.use("/logout", logout);

//& Protected Routes

router.post("/login", userService.login);
router.post("/registration", userService.registration);
router.get("/users/:userId", userService.userDetailById);
router.get("/users", userService.users);
router.get("/captcha", userService.captcha);


module.exports = router