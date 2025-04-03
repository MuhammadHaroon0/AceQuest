const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const apiRoutes = {
    // Auth routes
    login: `${BASE_URL}/users/login`,
    signup: `${BASE_URL}/users/signup`,
    logout: `${BASE_URL}/users/logout`,
    forgotPassword: `${BASE_URL}/users/forgotPassword`,
    resetPassword: (token: string) => `${BASE_URL}/users/resetPassword/${token}`,

    //user routes
    deleteUser: (id: string) => `${BASE_URL}/users/${id}`,
    getUser: (id: string) => `${BASE_URL}/users/${id}`,
    updatePassword: `${BASE_URL}/users/updatePassword`,
    updateMe: `${BASE_URL}/users/`,


    //jobDescription routes
    getMyJobDescriptions: `${BASE_URL}/jobDescriptions/getMyJobDescriptions`,
    getJob: (id: string) => `${BASE_URL}/jobDescriptions/${id}`,
    createJobDescription: `${BASE_URL}/jobDescriptions`,
    searchAssessment: (letter: string) => `${BASE_URL}/jobDescriptions/search/${letter}`,


    //company routes
    addCandidateToJob: `${BASE_URL}/companies/addCandidateToCompany`,
    getCandidatesBasedOnJobDescription: (id: string) => `${BASE_URL}/companies/getCandidatesBasedOnJobDescription/${id}`,
    getCandidateQuiz: (token: string) => `${BASE_URL}/companies/getCandidateQuiz?${token}`,
    getCandidateInterview: (token: string) => `${BASE_URL}/companies/getCandidateInterview?${token}`,
    getAllCompanies: `${BASE_URL}/companies/`,

    //subscription routes
    subscribe: `${BASE_URL}/subscriptions`,

    //performance routes
    addQuizResult: (token: string) => `${BASE_URL}/performances/addQuizResult?${token}`,
    addInterviewResult: (token: string) => `${BASE_URL}/performances/addInterviewResult?${token}`,
    getPerformanceByCandidateId:
        (candidateId: string) => `${BASE_URL}/performances//getPerformanceByCandidateId/${candidateId}`,

    //for students
    getMyPerformance:
        (jobDescriptionId: string) => `${BASE_URL}/performances/getMyPerformance/${jobDescriptionId}`,
    submitQuizResult: (jobDescriptionId: string) => `${BASE_URL}/performances/submitQuizResult/${jobDescriptionId}`,
    submitInterviewResult: (jobDescriptionId: string) => `${BASE_URL}/performances/submitInterviewResult/${jobDescriptionId}`,
    getAllStudents: `${BASE_URL}/users?accountType=student`,
};

export default apiRoutes;