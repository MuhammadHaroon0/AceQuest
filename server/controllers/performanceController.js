
const { companyModel } = require('../models/companyModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Response = require('../utils/serverResponse');
const performanceModel = require('../models/performanceModel');
const jwt = require("jsonwebtoken");
const jobDescriptionModel = require('../models/jobDescriptionModel');
const axios = require('axios')
const FormData = require('form-data');

exports.getPerformanceByCandidateId = catchAsync(async (req, res, next) => {
    const { candidateId } = req.params;

    const company = await companyModel
        .findOne({ userId: req.user.id }) // Find company by userId
        .populate({
            path: 'candidates', // Populate candidates
            populate: {
                path: 'performance', // Populate performance details
                select: 'quizScore interviewScore confidenceScore quizCorrectAnswers', // Select relevant fields
            },
        })
        .select('candidates'); // Only select the candidates field

    if (!company) {
        return next(new AppError('Company not found!', 404));
    }

    // 3. Find the candidate with the given candidateId
    const candidate = company.candidates.id(candidateId);

    // 4. Handle case where candidate is not found
    if (!candidate) {
        return next(new AppError('Candidate not found!', 404));
    }

    return res.status(200).json(
        new Response('success', candidate)
    );
});


exports.addQuizResult = catchAsync(async (req, res, next) => {
    let decoded
    try {
        decoded = jwt.verify(req.query.token, process.env.JWT_SECRET);
    } catch (error) {
        return next(new AppError("You have not given the test on time or the token is not valid!", 400))
    }
    const { answers } = req.body;
    const { companyId, jobDescriptionId, id } = decoded
    const company = await companyModel.findOne({
        _id: companyId,
        "candidates": {
            $elemMatch: { _id: id, jobDescription: jobDescriptionId }
        }
    });

    if (!company) {
        return next(new AppError("Candidate not found for this job in this company.", 404));
    }

    // Find the candidate within the company's candidates array
    const candidate = company.candidates.find(
        c => c._id.toString() === id.toString() && c.jobDescription.toString() === jobDescriptionId.toString()
    );

    if (!candidate) {
        return next(new AppError("Candidate not found for this job description.", 404));
    }

    const jobDescription = await jobDescriptionModel.findById(jobDescriptionId);
    if (!jobDescription || !jobDescription.quiz) {
        return next(new AppError("Quiz not found for this job description.", 404));
    }

    const quizQuestions = jobDescription.quiz;
    const totalQuestions = quizQuestions.length;
    // Validate answers
    if (!Array.isArray(answers) || answers.length !== totalQuestions) {
        return next(new AppError("Invalid answers format or missing answers.", 400));
    }

    let correctCount = 0;
    for (let i = 0; i < totalQuestions; i++) {
        console.log(answers);
        if (quizQuestions[i].correctAnswer === parseInt(answers[i])) {
            correctCount++;
        }
    }

    const quizScore = (correctCount / totalQuestions) * 100; // Convert to percentage

    let newPerformance

    if (candidate.performance) { return next(new AppError("You've already given the assessment", 403)) }

    newPerformance = await performanceModel.create({
        quizScore,
        quizCorrectAnswers: correctCount,
        jobDescription: candidate.jobDescription,
    });

    candidate.performance = newPerformance._id;
    await company.save();

    res.status(201).json(new Response("Quiz Submitted", newPerformance));

});


exports.addInterviewResult = catchAsync(async (req, res, next) => {
    let decoded
    try {
        decoded = jwt.verify(req.query.token, process.env.JWT_SECRET);
    } catch (error) {
        return next(new AppError("You have not given the test on time or the token is not valid!", 400))
    }
    const { answers } = req.body;
    const { companyId, jobDescriptionId, id } = decoded
    const company = await companyModel.findOne({
        _id: companyId,
        "candidates": {
            $elemMatch: { _id: id, jobDescription: jobDescriptionId }
        }
    });

    if (!company) {
        return next(new AppError("Candidate not found for this job in this company.", 404));
    }

    // Find the candidate within the company's candidates array
    const candidate = company.candidates.find(
        c => c._id.toString() === id.toString() && c.jobDescription.toString() === jobDescriptionId.toString()
    );

    if (!candidate) {
        return next(new AppError("Candidate not found for this job description.", 404));
    }

    const jobDescription = await jobDescriptionModel.findById(jobDescriptionId);
    if (!jobDescription || !jobDescription.interview) {
        return next(new AppError("Interview not found for this job description.", 404));
    }
    if (!candidate.performance) {
        return next(new AppError("You've to give the quiz first!", 403))
    }
    const performance = await performanceModel.findById(candidate.performance)
    if (performance.completed) { return next(new AppError("You've already given the interview", 403)) }

    let correctAnswers = jobDescription.interview.map(e => e.answer)
    correctAnswers = correctAnswers.join(" ")
    const form = new FormData();

    // Append the video file
    form.append('video_file', req.file.buffer, {
        filename: 'interview.webm',
        contentType: 'video/webm'
    });

    form.append('correct_answers', correctAnswers);
    form.append('user_answers', answers);

    const response = await axios.post(`${process.env.AI_API_URL}/assess-interview`, form, {
        headers: {
            ...form.getHeaders(),
        },
    });

    performance.interviewScore = response.data.interview_score;
    performance.confidenceScore = response.data.confidence_score;
    performance.completed = true
    await performance.save()

    res.status(201).json(new Response("success", performance));
});


//for students
exports.getMyPerformance = catchAsync(async (req, res, next) => {
    const { jobDescriptionId } = req.params;
    const performance = await performanceModel
        .findOne({
            jobDescription: jobDescriptionId
        })


    if (!performance) {
        return next(new AppError('You have not attempted the assessment yet', 404));
    }


    return res.status(200).json(
        new Response('success', performance)
    );
});

//for students
exports.submitQuizResult = catchAsync(async (req, res, next) => {

    const { answers } = req.body;
    const { jobDescriptionId } = req.params;
    const jobDescription = await jobDescriptionModel.findById(jobDescriptionId);
    if (!jobDescription || !jobDescription.quiz) {
        return next(new AppError("Quiz not found for this job description.", 404));
    }
    if (jobDescription.performance) { return next(new AppError("You've already given the assessment", 403)) }

    const quizQuestions = jobDescription.quiz; // Array of quiz questions
    const totalQuestions = quizQuestions.length;


    if (!Array.isArray(answers) || answers.length !== totalQuestions) {
        return next(new AppError("Invalid answers format or missing answers.", 400));
    }

    // Calculate quiz score
    let correctCount = 0;
    for (let i = 0; i < totalQuestions; i++) {
        if (quizQuestions[i].correctAnswer === parseInt(answers[i])) {
            correctCount++;
        }
    }

    const quizScore = (correctCount / totalQuestions) * 100; // Convert to percentage

    const newPerformance = await performanceModel.create({
        quizScore,
        quizCorrectAnswers: correctCount,
        jobDescription: jobDescriptionId,
    });

    jobDescription.performance = newPerformance._id;
    await jobDescription.save();

    res.status(201).json(new Response("Quiz Submitted", newPerformance));

});

exports.submitInterviewResult = catchAsync(async (req, res, next) => {
    const { answers } = req.body;
    const { jobDescriptionId } = req.params;


    const jobDescription = await jobDescriptionModel.findById(jobDescriptionId).populate('performance');
    if (!jobDescription || !jobDescription.interview) {
        return next(new AppError("Interview not found for this job description.", 404));
    }


    if (!jobDescription.performance) { return next(new AppError("You've to give the quiz first", 403)) }

    if (jobDescription.performance.completed) { return next(new AppError("You've already completed the assessment", 403)) }

    let correctAnswers = jobDescription.interview.map(e => e.answer)
    correctAnswers = correctAnswers.join(" ")
    const form = new FormData();

    // Append the video file
    form.append('video_file', req.file.buffer, {
        filename: 'interview.webm',
        contentType: 'video/webm'
    });

    form.append('correct_answers', correctAnswers);
    form.append('user_answers', answers);

    const response = await axios.post(`${process.env.AI_API_URL}/assess-interview`, form, {
        headers: {
            ...form.getHeaders(),
        },
    });
    console.log(response);

    const performance = await performanceModel.findById(jobDescription.performance)
    performance.interviewScore = response.data.interview_score;
    performance.confidenceScore = response.data.confidence_score;
    performance.completed = true
    await performance.save()

    // Send response
    res.status(201).json(new Response("Interview Completed", performance));
});


