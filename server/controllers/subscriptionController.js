const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/AppError");
const userModel = require("../models/userModel");
const Response = require("../utils/serverResponse");
const subscriptionModel = require("../models/subscriptionModel");


exports.subscribe = catchAsync(async (req, res, next) => {
    const user = await userModel.findById(req.user.id);
    if (req.user.accountType === 'company')
        req.body.noOfCandidatesInvited = 0
    if (user.subscription) {
        return next(new AppError("You already have an active subscription", 400));
    }
    if (req.user.accountType != req.body.availableTo)
        return next(new AppError("Access denied!", 403));

    const subscription = await subscriptionModel.create({ ...req.body, userId: req.user.id });

    const doc = await userModel.findByIdAndUpdate(req.user.id,
        { subscription: subscription._id }, { new: true });

    return res.status(200).json(new Response("success", { ...doc, message: "Subscription added successfully!" }));
});

exports.unsubscribe = catchAsync(async (req, res, next) => {

    //payment gate integration to purchase subscription
    const subscription = await subscriptionModel.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
    if (!subscription)
        return next(new AppError("Subscription not found matching this id", 404))
    const user = await userModel.findByIdAndUpdate(req.user.id,
        { $unset: { subscription: "" } }, { new: true })
    return res.status(200).json(new Response("success", user));
})

exports.getMySubscriptionPlan = catchAsync(async (req, res, next) => {
    const subscription = await subscriptionModel.findOne({ userId: req.user.id })
    return res.status(200).json(new Response("success", subscription));
})

//middleware for subscription check 
exports.isSubscribed = catchAsync(async (req, res, next) => {
    const subscription = await subscriptionModel.findOne({ userId: req.user.id })
    if (!subscription)
        return next(new AppError("You don't have a subscription plan yet!", 403))

    if (req.user.jobDescriptions.length >= subscription.noOfJobDescriptionsAvailable)
        return next(new AppError("You have reached your limit of creating jobs tests. upgrade your subscription plan, or delete a job description to continue", 403))

    if (subscription.currentPeriodEnd < new Date(Date.now()))
        return next(new AppError("Your subscription plan has been ended", 403))

    if (!subscription.active)
        return next(new AppError("Your subscription plan is inactive, Activate it to create jobs tests", 403))
    next()
})

//middleware for subscription check 
exports.checkNoOfCandidatesInvited = catchAsync(async (req, res, next) => {
    const subscription = await subscriptionModel.findOne({ userId: req.user.id })
    if (!subscription)
        return next(new AppError("You don't have an active subscription plan!", 403))

    if (subscription.currentPeriodEnd < new Date(Date.now()))
        return next(new AppError("Your subscription plan has been ended", 403))


    if (req.user.accountType === 'company' && subscription.noOfCandidatesAllowed < subscription.noOfCandidatesInvited)
        return next(new AppError("You have reached your limit of iniviting candidates. upgrade your subscription plan", 403))
    next()
})