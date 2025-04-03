const express = require("express");
const router = express.Router();
const {
    getOne,
    getAll,
    createOne,
    deleteOne,
} = require("../controllers/handlerFactory");

const { protect, restriction } = require("../controllers/authController");
const performanceModel = require("../models/performanceModel.js");
const { addQuizResult, addInterviewResult, getPerformanceByCandidateId, getMyPerformance, submitInterviewResult, submitQuizResult } = require("../controllers/performanceController.js");
const multer = require('multer')
const upload = multer();

router.route("/")
    .post(protect, createOne(performanceModel))
    .get(protect, getAll(performanceModel))

//for candidates 
router.route("/addQuizResult").post(addQuizResult)
router.route("/addInterviewResult").post(upload.single("video"), addInterviewResult)
router.route("/getPerformanceByCandidateId/:candidateId").get(protect, restriction("company"), getPerformanceByCandidateId)


//for students
router.route("/submitQuizResult/:jobDescriptionId").post(protect, restriction('student'), submitQuizResult)
router.route("/submitInterviewResult/:jobDescriptionId").post(protect, restriction('student'), upload.single("video"), submitInterviewResult)
router.route("/getMyPerformance/:jobDescriptionId").get(protect, restriction("student"), getMyPerformance)

router.route("/:id")
    .get(getOne(performanceModel))
    .delete(protect, deleteOne(performanceModel))


module.exports = router;
