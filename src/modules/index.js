const router = require("express").Router();
const user = require("./users/controller");
const form = require("./form/controller");
const transaction = require("./transactions/controller");

router.post("/signup", user.addUser);
router.post("/signin", user.signInUser);
router.post("/fetchUserById", user.fetchUserById);
router.get("/fetchUsers", user.fetchUsers);
router.post("/updateForm8843", form.updateForm);
router.post("/fetchFrom8843ById", form.fetchFromById);
router.post("/createCheckoutSession", transaction.createCheckoutSession);

module.exports = router;
 