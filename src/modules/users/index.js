const router = require("express").Router();
const userController = require("./controller");

router.post("/signup", userController.addUser);
router.post("/signin", userController.signInUser);
router.post("/fetchUserById", userController.fetchUserById);
router.get("/fetchUsers", userController.fetchUsers);
router.post("/updateForm8843", userController.updateForm8843);
router.post("/fetchFrom8843ById", userController.fetchFrom8843ById);
router.post("/createCheckoutSession", userController.createCheckoutSession);

module.exports = router;
 