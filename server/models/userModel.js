const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var validator = require("validator");
const crypto = require("crypto");
const saltRounds = 12;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],

  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    minLength: 7,
    maxLength: 50,
    validate: [validator.isEmail, "Email should be valid"],
  },
  contact: {
    type: String,
  },
  password: {
    type: String,
    minLength: 7,
    select: false,
    validate: {
      validator: function (value) {
        // Regular expression to match at least one letter, one number, and one special character
        const regex =
          /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        return regex.test(value);
      },
      message:
        "Password must contain at least one letter, one number, and one special character.",
    },
  },
  accountType: {
    type: String,
    enum: ["student", "company", "admin"],
    default: "student",
  },

  active: {
    type: Boolean,
    default: true,
  },
  approve: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    default: undefined,
    select: false
  },
  image: {
    type: String,
    default: "https://res.cloudinary.com/djmlypicw/image/upload/v1709749612/pkpnjfz55dywuaakptx6.jpg",
  },
  authMethod: {
    type: String,
    enum: ['google', 'self'],
    default: 'self'
  },
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subscription"
  },
  jobDescriptions: [{

    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobDescription'

  }],
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
  lastChangedPassword: Date,
},
  { timestamps: true },
  {

    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  })

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) {
    return next();
  }
  this.lastChangedPassword = Date.now() - 1000;

  next();
});

userSchema.methods.correctPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.checkPasswordchanged = function (JWTTIMESTAMP) {
  if (!this.lastChangedPassword) return 0;
  const time = this.lastChangedPassword.getTime() / 1000;
  return time > JWTTIMESTAMP;
};

userSchema.methods.getPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000; //expire after 10 minutes
  return resetToken;
};

//To provide efficient searching of mongodb
// userSchema.index({ SOMETHING : 1, SOMETHING: -1 }); //1 for ascending -1 for descending

//Document middlewares,can work before or after save or create
// Pre Save Hook
// userSchema.pre('save',function(next){
//     //query middleware
//     next()
// })

// userSchema.pre(/^find/,function(next){
//     //query middleware
//     next()
// })

//Post Save Hook
//The save hook doenst works for findAndUpdate and insertMany etc
// tourSchema.post('save', function (doc, next) {
//   next();
// });

//? Aggeregation Middleware, works before or after aggregation function
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: {  } });
//   next();
// });

// userSchema.methods.FUNCTIONNAME=function()
// {
//     //member functions
// }

//usually for child-parent referencing
module.exports = mongoose.model("User", userSchema);






