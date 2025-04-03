const { signTokenForTest } = require("../config/jwt");
const { companyModel, candidateSchema } = require("../models/companyModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const Email = require("../utils/email");
const Response = require("../utils/serverResponse");
const mongoose = require('mongoose');
const performanceModel = require("../models/performanceModel");
const subscriptionModel = require("../models/subscriptionModel");
const jobDescriptionModel = require("../models/jobDescriptionModel");

exports.getCandidatesFromCompany = catchAsync(async (req, res, next) => {
    const data = await companyModel.findOne({ userId: req.user.id }).select("candidates")

    if (!data) {
        return next(new AppError("Company not found!", 404))
    }

    return res.status(200).json(new Response("success", data))
})


exports.getCandidatesBasedOnJobDescription = catchAsync(async (req, res, next) => {
    const jobDescriptionId = new mongoose.Types.ObjectId(req.params.id);

    try {
        // Parse pagination params
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Aggregation pipeline with sorting & pagination
        let aggregationPipeline = [
            {
                $match: {
                    'candidates.jobDescription': jobDescriptionId,
                },
            },
            {
                $project: {
                    _id: 0,
                    candidates: {
                        $filter: {
                            input: '$candidates',
                            as: 'candidate',
                            cond: { $eq: ['$$candidate.jobDescription', jobDescriptionId] },
                        },
                    },
                },
            },
            { $unwind: "$candidates" }, // Flatten candidates array
            { $sort: { "candidates.createdAt": -1 } }, // Sort by createdAt (newest first)
            { $skip: skip }, // Skip for pagination
            { $limit: limit } // Limit the number of candidates per page
        ];

        const result = await companyModel.aggregate(aggregationPipeline);

        return res.status(200).json(new Response('success', result.map(r => r.candidates)));

    } catch (error) {
        console.error('Error fetching candidates:', error);
        return next(new AppError('Error fetching candidates!', 500));
    }
});



exports.addCandidateToJob = catchAsync(async (req, res, next) => {
    const { candidateEmail, candidateName, jobDescription } = req.body;

    if (!candidateEmail)
        return next(new AppError("Please provide candidate email", 400));
    if (!jobDescription)
        return next(new AppError("Please provide a valid jobDescription id", 400));

    if (!req.user.jobDescriptions.includes(jobDescription))
        return next(new AppError("Job description not found in the company!", 400));

    const subscription = await subscriptionModel.findById(req.user.subscription)
    subscription.noOfCandidatesInvited = subscription.noOfCandidatesInvited + 1;

    // Check if the candidate email already exists within the company's candidates array
    const existingCandidate = await companyModel.findOne({
        userId: req.user.id,
        "candidates": {
            $elemMatch: { email: candidateEmail, jobDescription: jobDescription }
        }
    });

    if (existingCandidate) {
        return next(new AppError("This candidate is already registered for this job.", 400));
    }

    // Generate a new ObjectId for the candidate
    const candidateId = new mongoose.Types.ObjectId();

    const newCandidate = {
        _id: candidateId,
        email: candidateEmail,
        name: candidateName,
        jobDescription: jobDescription,
    };

    // Add the new candidate using $addToSet to avoid duplicates
    const company = await companyModel.findOneAndUpdate(
        { userId: req.user.id },
        { $addToSet: { candidates: newCandidate } }, // Ensure uniqueness at the array level
        { new: true }
    );

    if (!company) {
        return next(new AppError("Company not found!", 404));
    }

    // Generate the token using the candidate's ID
    const token = signTokenForTest(candidateId, company._id, jobDescription);
    const testLink = `${process.env.FRONTEND_URL}/quiz/token=${token}`;
    try {
        await new Email(newCandidate).sendTestLink(company.name, testLink)
    } catch (error) {
        await companyModel.findOneAndUpdate(
            { userId: req.user.id },
            { $pull: { candidates: newCandidate } }, // Ensure uniqueness at the array level
            { new: true }
        );
        return next(new AppError("Failed to send email to candidate. Try again later.", 500));
    }
    await subscription.save()

    return res.status(201).json(new Response("success", newCandidate));
});



exports.removeCandidateFromCompany = catchAsync(async (req, res, next) => {
    // Find the company and candidate to retrieve the performance report ID
    const company = await companyModel.findOne(
        { userId: req.user.id, "candidates._id": req.body.candidateId },
        { "candidates.$": 1 }
    );

    if (!company) {
        return next(new AppError("Candidate not present in this company!", 404));
    }

    const candidate = company.candidates[0];
    if (!candidate) {
        return next(new AppError("Candidate not found!", 404));
    }

    // Remove the associated performance report if it exists
    if (candidate.performance) {
        await performanceModel.findByIdAndDelete(candidate.performance);
    }

    // Remove the candidate from the company's candidates array
    await companyModel.findOneAndUpdate(
        { userId: req.user.id },
        { $pull: { candidates: { _id: req.body.candidateId } } },
        { new: true }
    );

    return res.status(204).json(new Response("success", "Candidate and associated performance report removed successfully."));
});


exports.getCandidateQuiz = catchAsync(async (req, res, next) => {
    let decoded
    try {
        decoded = jwt.verify(req.query.token, process.env.JWT_SECRET);
    } catch (error) {
        return next(new AppError("You have not given the test on time or the token is not valid!", 400))
    }
    const company = await companyModel.findOne({ _id: decoded.companyId })


    if (!company) {
        return next(new AppError('Candidate not found in this company.', 404))
    }

    const candidate = company.candidates.id(decoded.id);

    if (!candidate || !candidate.jobDescription) {
        return next(new AppError('Job description or quiz not found for the candidate.', 404))
    }

    if (candidate.performance)
        return next(new AppError('You have already given the quiz.', 403))

    const quiz = await jobDescriptionModel
        .findById(candidate.jobDescription)
        .select('quiz quizDuration')
        .lean(); // Convert Mongoose document to a plain object

    // Remove `correctAnswer` from each quiz question manually
    if (quiz && quiz.quiz) {
        quiz.quiz = quiz.quiz.map(({ correctAnswer, ...rest }) => rest);
    }


    return res.status(200).json(new Response("success", { quiz: [...quiz.quiz], quizDuration: quiz.quizDuration }))
})


exports.getCandidateInterview = catchAsync(async (req, res, next) => {
    let decoded
    try {
        decoded = jwt.verify(req.query.token, process.env.JWT_SECRET);
    } catch (error) {
        return next(new AppError("You have not given the test on time!", 400))
    }
    const company = await companyModel.findOne({ _id: decoded.companyId })

    if (!company) {
        return next(new AppError('Candidate not found in this company.', 404))
    }

    const candidate = company.candidates.id(decoded.id);

    if (!candidate || !candidate.jobDescription) {
        return next(new AppError('Job description or interview not found for the candidate.', 404))
    }
    if (candidate.performance) {
        const performance = await performanceModel.findById(candidate.performance)
        if (performance.completed)
            return next(new AppError('You have already given the interview.', 403))
    }

    const interview = await jobDescriptionModel
        .findById(candidate.jobDescription)
        .select('interview noOfInterviewQuestions')
        .lean(); // Convert Mongoose document to a plain object

    // Remove `correctAnswer` from each quiz question manually
    if (interview && interview.interview) {
        interview.interview = interview.interview.map(({ correctAnswer, ...rest }) => rest);
    }

    return res.status(200).json(new Response("success", interview.interview))
})


