const router = require("express").Router();
const userController = require("./controller");

router.post("/signup", userController.addUser);
router.post("/signin", userController.signInUser);

module.exports = router;
 