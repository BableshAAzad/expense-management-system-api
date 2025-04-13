let express = require('express');
let filesProcessService = require("../services/filesProcessService.js");
const router = express.Router();
// const checkUserAuth = require("../middleware/authMiddleware.js");

//& Route Level Middleware - To Protect Route


//& Protected Routes

// * pubic routes
router.post("/add-image", filesProcessService.addImageInTempFolder);
router.post("/add-pdf", filesProcessService.addPdfInTempFolder);


module.exports = router