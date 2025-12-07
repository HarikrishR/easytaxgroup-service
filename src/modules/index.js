const router = require("express").Router();
const user = require("./users/controller");
const form = require("./form/controller");
const transaction = require("./transactions/controller");
const orders = require("./orders/controller");

router.post("/signup", user.addUser);
router.post("/signin", user.signInUser);
router.post("/forgotPassword", user.forgotPassword);
router.post("/verifyOTP", user.verifyOTP);
router.post("/changePassword", user.changePassword);
router.post("/fetchUserById", user.fetchUserById);
router.get("/fetchUsers", user.fetchUsers);
router.post("/updateForm8843", form.updateForm);
router.post("/fetchFrom8843ById", form.fetchFromById);
router.post("/createCheckoutSession", transaction.createCheckoutSession);
router.post("/updateTransaction", transaction.updateTransaction);
router.post("/createOrder", orders.createOrder);
router.post("/fetchOrdersById", orders.fetchOrdersById);
router.get("/fetchOrders", orders.fetchOrders);
router.post("/updateOrderStatus", orders.updateOrderStatus);
router.post("/usdotapplication", user.createUsdotapplication);

module.exports = router;
 