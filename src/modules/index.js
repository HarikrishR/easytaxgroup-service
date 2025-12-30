const router = require("express").Router();
const user = require("./users/controller");
const form = require("./form/controller");
const transaction = require("./transactions/controller");
const orders = require("./orders/controller");
// 1. IMPORT THE NEW ROUTER FILE
const usdotApplicationRouter = require("./users/usdot_routes");
const businessResgistrationApplicationRouter = require("./users/businessReg_routes");

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
router.get("/fetchUsdotapplications", user.fetchUsdotapplications);
router.use(usdotApplicationRouter); 
router.get("/fetchBusinessRegApplication", user.fetchBusinessRegistrationApplications);
router.use(businessResgistrationApplicationRouter); 
router.post("/formf1Registration", user.createFormF1VisaRegApp);
router.get("/fetchFormf1RegApplication", user.fetchFormf1RegApp);


module.exports = router;