const { companyModel, candidateSchema } = require("../models/companyModel");
const jobDescriptionModel = require("../models/jobDescriptionModel");
const performanceModel = require("../models/performanceModel");
const axios = require('axios');
const userModel = require("../models/userModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const Response = require("../utils/serverResponse");

exports.createJobDescription = catchAsync(async (req, res, next) => {
    const { title, description, experience, quizDuration, noOfInterviewQuestions } = req.body

    const modelResponse = await axios.post(process.env.AI_API_URL + "/create-assessment",
        { jobDescription: description, quizDuration: quizDuration, noOfInterviewQuestions: noOfInterviewQuestions })
    const quiz = modelResponse.data.quiz_questions
    const interview = modelResponse.data.interview_questions
    const formattedQuiz = quiz.flatMap(group =>
        group.questions.map(q => ({
            question: q.question,
            correctAnswer: q.correctAnswerIndex, // Convert index to actual answer
            allAnswers: q.answers
        }))
    );

    // Create job description object
    const jobDescriptionData = {
        title: title,
        description: description,
        experience: experience,  // Example experience requirement
        quiz: formattedQuiz, // Processed quiz questions
        interview: interview.questions, // Processed interview questions
        noOfInterviewQuestions: noOfInterviewQuestions,
        quizDuration: quizDuration,
    };
    const doc = await jobDescriptionModel.create(jobDescriptionData)
    await userModel.findByIdAndUpdate(req.user.id, {
        $push: { jobDescriptions: doc._id }
    })
    return res.status(200).json(new Response("success", { ...doc.toObject(), message: "Assessment created successfully" }));

})
exports.getMyJobDescriptions = catchAsync(async (req, res, next) => {

    const doc = await jobDescriptionModel.find({ _id: { $in: req.user.jobDescriptions } }, { description: 0, quiz: 0, interview: 0 });
    return res.status(200).json(new Response("success", doc))
})


exports.deleteJobDescription = catchAsync(async (req, res, next) => {
    const doc = await jobDescriptionModel.findByIdAndDelete(req.params.id)
    if (!doc)
        return next(new AppError("Document not found matching this id", 404))

    await userModel.findByIdAndUpdate(req.user.id, {
        $pull: { jobDescriptions: req.params.id }
    })

    await companyModel.updateOne(
        { userId: req.user.id }, // Filter companies with matching candidates
        {
            $pull: { candidates: { jobDescription: req.params.id } }, // Pull matching candidates
        }
    );

    await performanceModel.deleteMany({ jobDescription: req.params.id })
    return res.status(204).json(new Response("success", doc))
})

exports.searchJobDescription = catchAsync(async (req, res, next) => {

    const jobs = await jobDescriptionModel.find({
        title: { $regex: `^${req.params.letter}`, $options: 'i' },
        _id: { $in: req.user.jobDescriptions }
    }).limit(10);

    return res.status(200).json(new Response("success", jobs));
});
