const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/AppError");
const Email = require("./../utils/email");
const crypto = require("crypto");
const { signToken } = require("../config/jwt");
const { companyModel } = require("../models/companyModel");

exports.signUp = catchAsync(async (req, res, next) => {
  if (!req.body.email || !req.body.password)
    return next(new AppError("Please provide email and password!", 400));

  if (req.body.accountType === "company" && (!req.body.companyName || !req.body.companyWebsite))
    return next(new AppError("Please provide company name and website!", 400));

  if (req.body.accountType === 'admin') {
    req.body.accountType = "student"
  }
  const newUser = await new userModel(req.body);
  const token = signToken(newUser._id, res);

  const verToken = crypto.randomBytes(20).toString('hex');

  // Save token to user document
  newUser.verificationToken = verToken;
  await newUser.save();
  let companyData = null;
  if (req.body.accountType === "company") {
    const company = await companyModel.create({ name: req.body.companyName, website: req.body.companyWebsite, userId: newUser._id })
    companyData = {
      name: company.name,
      website: company.website,
      id: company._id,
    };
  }
  try {
    await new Email(newUser).sendWelcome(verToken);
  } catch (error) {
    console.log(error);
  }

  return res.status(201).json({
    status: "success",
    token: token,
    data: {
      name: newUser.name,
      id: newUser._id,
      accountType: newUser.accountType,
      authMethod: "self",
      ...(companyData && { company: companyData }), // Include company data if it exists

    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  if (!req.body.email || !req.body.password)
    return next(new AppError("Please provide both email and password!", 400));

  const found = await userModel
    .findOne({ email: req.body.email })
    .select("+password");
  if (!found) return next(new AppError("Please provide valid email!", 400));
  if (found.authMethod === 'google') {
    return next(new AppError("You can only login with google", 403))
  }
  if (!(await found.correctPassword(req.body.password)))
    return next(new AppError("Please provide valid password!", 400));
  if (!found.approve)
    return next(
      new AppError(
        "User not verified! Verify to activate your account",
        403
      )
    );
  found.active = true;
  await found.save({ validateBeforeSave: false });
  const token = signToken(found._id, res);
  let company = null
  if (found.accountType === "company")
    company = await companyModel.findOne({ userId: found._id })
  return res.status(200).json({
    status: "success",
    token: token,
    data: {
      id: found._id,
      name: found.name,
      accountType: found.accountType,
      ...(company && { company: company }), // Include company data if it exists

    },
  });
});

exports.logout = catchAsync(async (req, res, next) => {
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' });
  return res.status(200).json({ status: "success", message: "Logout successful" })
})


exports.isOwner = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let isOwner = false;

  const user = await userModel.findById(req.user.id);
  if (user && user.jobDescriptions.includes(id)) {
    isOwner = true;


  }
  if (!isOwner) {
    return next(new AppError("Forbidden you dont have access to other's job Descriptions", 403))
  }
  // else if (req.route.path.includes('/users')) {
  //   if (id === req.user.id) {
  //     isOwner = true;
  //   }
  // }
  next()

})


exports.verify = catchAsync(async (req, res, next) => {
  const user = await userModel.findOne({ verificationToken: req.params.token });

  if (!user) {
    return res.status(404).send('Invalid verification token.');
  }

  // Mark user's email as verified
  user.approve = true;
  user.verificationToken = undefined; // Clear verification token
  await user.save();

  res.status(200).send('Email verified successfully.');
});


exports.protect = catchAsync(async (req, res, next) => {
  const token = req.header("x-auth-token") || req.cookies.jwt;
  if (!token) return next(new AppError("Please provide auth token!", 401));

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const found = await userModel.findById(decoded.id);
  if (!found) return next(new AppError("User not exists!", 401));

  if (found.checkPasswordchanged(decoded.iat))
    return next(new AppError("User changed the password!", 401));

  if (!found.active)
    return next(
      new AppError(
        "User no longer exists! Login to activate your account again",
        403
      )
    );
  if (!found.approve)
    return next(
      new AppError(
        "User not verified! Verify to activate your account",
        403
      )
    );

  req.user = found;
  // console.log(token);
  // console.log("asas");
  return next();
});

exports.restriction = (...accountType) => {
  return (req, res, next) => {
    if (!accountType.includes(req.user.accountType)) {
      // console.log(accountType.includes(req.user.accountType));
      return next(new AppError("Access denied!", 403));
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  if (!req.body.email)
    return next(new AppError("Please provide an email!", 404));

  const found = await userModel
    .findOne({ email: req.body.email })
    .select("+email");
  if (!found) return next(new AppError("Please provide a valid email!", 404));

  const resetToken = found.getPasswordResetToken();
  try {
    const url = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await new Email(found).sendResetPassword(url);
    await found.save({ validateBeforeSave: false });
    res.status(200).json({
      status: "success",
      message: "Password reset token sent",
    });
  } catch (error) {
    found.passwordResetToken = undefined;
    found.passwordResetTokenExpires = undefined;
    await found.save({ validateBeforeSave: false });
    next(
      new AppError("Email not sent for password reset! Try again later", 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //on clicking the button in frontend patch the request to this route
  const resetToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");
  const found = await userModel.findOne({
    passwordResetToken: resetToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });
  if (!found) return next(new AppError("Token is invalid or expired!", 400));

  found.password = req.body.password;
  found.passwordResetToken = undefined;
  found.passwordResetTokenExpires = undefined;

  // console.log(req.body);
  await found.save();
  const token = signToken(found._id, res);
  res.status(200).json({
    status: "success",
    token: token,
    message: "Password reset successful"
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  if (!req.body.oldPassword)
    return next(new AppError("Please provide your old password!", 400));
  console.log(req.body);
  const found = await userModel.findById(req.user.id).select("+password");
  if (!(await found.correctPassword(req.body.oldPassword)))
    return next(new AppError("Old password is incorrect!", 400));

  found.password = req.body.newPassword;
  await found.save();

  const token = signToken(found._id, res);
  res.status(200).json({
    status: "success",
    token: token,
  });
});
