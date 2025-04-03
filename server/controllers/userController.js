const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/AppError");
const userModel = require("../models/userModel");
const Response = require("../utils/serverResponse");
const { imageMulter } = require("./../utils/multerConfig");
const Email = require("../utils/email");
const sharp = require("sharp");

const APIFeatures = require("./../utils/apiFeatures");
const { companyModel } = require("../models/companyModel");
const performanceModel = require("../models/performanceModel");
const jobDescriptionModel = require("../models/jobDescriptionModel");
const subscriptionModel = require("../models/subscriptionModel");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  let doc = new APIFeatures(
    userModel.find({ isActive: { $ne: false } }),
    req.query
  )
    .filter()
    .sort()
    .paginate()
    .limitFields();
  doc = await doc.query;

  return res.status(200).json(new Response("success", doc));
});




exports.deleteMe = catchAsync(async (req, res, next) => {
  const doc = await userModel.findByIdAndUpdate(
    req.user.id,
    { active: false },
    { new: true }
  );
  return res.status(204).json({
    status: "success",
    data: {
      doc,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.file) req.body.image = req.file.fileName;
  const doc = await userModel.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });
  return res.status(200).json({
    status: "success",
    data: {
      doc,
    },
  });
});

exports.uploadUserImage = imageMulter.single("image");

exports.resizeUserImage = catchAsync(async (req, res, next) => {

  if (!req.file) return next();

  req.file.buffer = await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toBuffer()
  // .toFile(`public/images/users/${req.file.fileName}`);
  next();
});



exports.deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const { user } = req.body

  if (user.accountType === "company") {
    await companyModel.findOneAndDelete({ userId: user._id });
  }

  if (user.jobDescriptions && user.jobDescriptions.length > 0) {
    await performanceModel.deleteMany({
      jobDescription: { $in: user.jobDescriptions },
    });

    // Delete all job descriptions
    await jobDescriptionModel.deleteMany({ _id: { $in: user.jobDescriptions } });
  }

  // If user has a subscription, delete it
  if (user.subscription) {
    await subscriptionModel.findByIdAndDelete(user.subscription);
  }

  await userModel.findByIdAndDelete(id);

  res.status(200).json({
    status: "success",
    message: "User deleted successfully",
  });
});




