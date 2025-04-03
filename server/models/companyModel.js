const mongoose = require("mongoose");
var validator = require("validator");
const crypto = require("crypto");
const candidateSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "email is required"],
        maxLength: 50,
        validate: [validator.isEmail, "Email should be valid"],
    },
    name: {
        type: String,
        required: [true, "name is required"],
        minLength: 4,
        maxLength: 30,
    },
    performance: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Performance'
    },
    jobDescription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobDescription'
    },

}, { timestamps: true })


const companySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User id is required to which company belongs to']
    },
    name: {
        type: String,
        required: [true, "Company name is required"],

    },
    website: {
        type: String,
        required: [true, "Company website is required"],

    },

    candidates: [candidateSchema],

},
    { timestamps: true },
    {

        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    })



//To provide efficient searching of mongodb
// companySchema.index({ SOMETHING : 1, SOMETHING: -1 }); //1 for ascending -1 for descending

//Document middlewares,can work before or after save or create
// Pre Save Hook
// companySchema.pre('save',function(next){
//     //query middleware
//     next()
// })

// companySchema.pre(/^find/,function(next){
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

// companySchema.methods.FUNCTIONNAME=function()
// {
//     //member functions
// }

//usually for child-parent referencing
exports.companyModel = mongoose.model("Company", companySchema);
exports.candidateSchema = candidateSchema






