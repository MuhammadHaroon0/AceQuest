const express = require("express");
const router = express.Router();
const {
    updateOne,
    getOne,
    getAll,
    createOne,
} = require("../controllers/handlerFactory");

const { protect, restriction, isOwner } = require("../controllers/authController");
const { companyModel } = require("../models/companyModel");
const { addCandidateToJob, removeCandidateFromCompany, getCandidatesFromCompany, getCandidatesBasedOnJobDescription, getCandidateQuiz, getCandidateInterview } = require("../controllers/companyController");
const { checkNoOfCandidatesInvited } = require("../controllers/subscriptionController");

router.route("/")
    .post(protect, createOne(companyModel))
    .get(protect, getAll(companyModel, "userId"))

router.route("/addCandidateToCompany")
    .patch(protect, restriction("company"), checkNoOfCandidatesInvited, addCandidateToJob)

router.route("/removeCandidateFromCompany")
    .patch(protect, restriction("company"), removeCandidateFromCompany)

router.route("/getCandidatesFromCompany")
    .get(protect, restriction("company"), getCandidatesFromCompany)



router.route("/getCandidatesBasedOnJobDescription/:id")
    .get(protect, restriction("company"), isOwner, getCandidatesBasedOnJobDescription)



router.route('/getCandidateQuiz').get(getCandidateQuiz) //give the token in query 
router.route('/getCandidateInterview').get(getCandidateInterview)  //give the token in query 

router.route("/:id")
    .get(protect, getOne(companyModel))
    // .delete(protect, deleteOne(companyModel))
    .patch(protect, updateOne(companyModel))


module.exports = router;
