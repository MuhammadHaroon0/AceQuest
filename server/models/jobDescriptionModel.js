const mongoose = require("mongoose");
var validator = require("validator");
const crypto = require("crypto");

const quizQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Question is required']
    },
    correctAnswer: {
        type: Number,
        required: [true, 'correctAnswer is required'],
    },
    allAnswers: {
        type: [String],
        required: [true, "allAnswers is required"]
    }
})

const interviewQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Question is required']
    },
    answer: {
        type: String,
        required: [true, 'correctAnswer is required']
    },

})
const jobDescriptionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "title is required"],
        minLength: 4,
    },
    description: {
        type: String,
        required: [true, 'Job description is required']
    },
    experience: {
        type: Number,
        required: [true, 'Experience is required']
    },
    quiz: [quizQuestionSchema],
    interview: [interviewQuestionSchema],
    noOfInterviewQuestions: {
        type: Number,
        default: 5
    },
    quizDuration: {
        type: String,
        enum: ['20min', '30min'],
        default: '20min'
    }
    , performance: { //for students
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Performance'
    }
},
    { timestamps: true },
    {

        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    })



//To provide efficient searching of mongodb
// jobDescriptionSchema.index({ SOMETHING : 1, SOMETHING: -1 }); //1 for ascending -1 for descending

//Document middlewares,can work before or after save or create
// Pre Save Hook
// jobDescriptionSchema.pre('save',function(next){
//     //query middleware
//     next()
// })

// jobDescriptionSchema.pre(/^find/,function(next){
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

// jobDescriptionSchema.methods.FUNCTIONNAME=function()
// {
//     //member functions
// }

//usually for child-parent referencing
module.exports = mongoose.model("JobDescription", jobDescriptionSchema);






