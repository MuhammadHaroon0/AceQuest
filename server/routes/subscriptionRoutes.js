const express = require("express");
const router = express.Router();
const {
    updateOne,
    getOne,
    getAll,
    createOne,
    deleteOne,
} = require("../controllers/handlerFactory");

const { protect, restriction } = require("../controllers/authController");
const subscriptionModel = require("../models/subscriptionModel");
const { subscribe, getMySubscriptionPlan, unsubscribe } = require("../controllers/subscriptionController");
router.route("/")
    .post(protect, subscribe)
    .get(protect, restriction("admin"), getAll(subscriptionModel))

router.route('/getMySubscriptionPlan').get(protect, getMySubscriptionPlan)


router.route("/:id")
    .delete(protect, unsubscribe)


module.exports = router;
