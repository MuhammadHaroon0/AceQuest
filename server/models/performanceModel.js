const mongoose = require("mongoose");
var validator = require("validator");
const crypto = require("crypto");

const performanceSchema = new mongoose.Schema({
    quizScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },
    interviewScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },
    confidenceScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },
    quizCorrectAnswers: {
        type: Number,
        min: 0,
        default: 0,
    },
    completed: {
        type: Boolean,
        default: false
    },
    jobDescription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobDescription'
    },

},
    { timestamps: true },
    {

        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    })



//To provide efficient searching of mongodb
// performanceSchema.index({ SOMETHING : 1, SOMETHING: -1 }); //1 for ascending -1 for descending

//Document middlewares,can work before or after save or create
// Pre Save Hook
// performanceSchema.pre('save',function(next){
//     //query middleware
//     next()
// })

// performanceSchema.pre(/^find/,function(next){
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

// performanceSchema.methods.FUNCTIONNAME=function()
// {
//     //member functions
// }

//usually for child-parent referencing
module.exports = mongoose.model("Performance", performanceSchema);






