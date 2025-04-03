import React, { useEffect } from "react"; // Import React
import "./App.css";
import Home from './pages/Home';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Aboutus from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import { Route, Routes, useNavigate } from "react-router-dom";
import CreateQuizPage from "./pages/CreateQuizPage";
import Assessments from "./pages/Assesments";
import Quiz from "./pages/Quiz";
import Interview from "./pages/Interview";
import MainLayout from "./MainLayout";
import Students from "./components/dashboard/pages/Students/Students";
import Companies from "./components/dashboard/pages/Companies/Companies";
import Analytics from "./components/dashboard/pages/Analytics/Analytics";
import Layout from "./components/dashboard/template/Layout";
import Pricing from "./pages/Pricing";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";

import { setupAxiosInterceptors } from "./utils/axiosInstance";
import ProtectedRoute from "./utils/ProtectectedRoute";
import useAuthStore from "./stores/useAuthStore";
import GuestRoute from "./utils/GuestRoute";
import Profile from "./components/dashboard/pages/Profile/Profile";
import Error404 from "./pages/Error404";
import UnauthorizedAccess from "./pages/Unauthorized";
import IndividualAssessmentPage from "./pages/IndividualAssessmentPage";

const App: React.FC = () => {

  const navigate = useNavigate();
  const { removeUser } = useAuthStore()

  useEffect(() => {
    setupAxiosInterceptors(navigate, removeUser);
  }, [navigate]);
  return (
    <div className='bg-richblack-900 text-richblack-25'>

      <Routes>
        <Route path="/" element={
          <MainLayout>
            <Home />
          </MainLayout>
        } />
        <Route path="/login" element={
          <MainLayout>
            <GuestRoute>
              <Login />
            </GuestRoute>
          </MainLayout>
        } />
        <Route path="/signup" element={
          <MainLayout>
            <GuestRoute>
              <Signup />
            </GuestRoute>
          </MainLayout>
        } />
        <Route path="/contact-us" element={
          <MainLayout>
            <ContactUs />
          </MainLayout>
        } />
        <Route path="/about-us" element={
          <MainLayout>
            <Aboutus />
          </MainLayout>
        } />
        <Route path="/create-assessment" element={
          <MainLayout>
            <ProtectedRoute allowedRoles={["company", "student"]}>
              <CreateQuizPage />
            </ProtectedRoute>
          </MainLayout>
        } />
        <Route path="/assessments" element={
          <MainLayout>
            <ProtectedRoute allowedRoles={["company", "student"]}>
              <Assessments />
            </ProtectedRoute>
          </MainLayout>
        } />

        <Route path="/assessment/:jobId" element={
          <MainLayout>
            <ProtectedRoute allowedRoles={["company", "student"]}>
              <IndividualAssessmentPage />
            </ProtectedRoute>
          </MainLayout>
        } />
        <Route path="/pricing" element={
          <MainLayout>
            <Pricing />
          </MainLayout>
        } />

        <Route path="/forgot-password" element={
          <MainLayout>
            <GuestRoute>
              <ForgetPassword />
            </GuestRoute>
          </MainLayout>
        } />

        <Route path="/reset-password/:token" element={
          <MainLayout>
            <GuestRoute>
              <ResetPassword />
            </GuestRoute>
          </MainLayout>
        } />

        <Route path="/quiz/:token" element={<Quiz />} />
        <Route path="/interview/:token" element={<Interview />} />




        {/* Admin and performance report routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={["company", "student", "admin"]}>
            <Layout />
          </ProtectedRoute>
        } >
          <Route path="profile" element={
            <Profile />
          } />
          <Route path="students" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Students />
            </ProtectedRoute>
          } />
          <Route path="companies" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Companies />
            </ProtectedRoute>
          } />
          <Route path="analytics" element={
            <Analytics />
          } />

        </Route>

        {/* Unauthorized Access */}
        <Route path="unauthorized" element={<MainLayout>
          <UnauthorizedAccess />
        </MainLayout>} />

        {/* // 404 page */}
        <Route path="*" element={
          <MainLayout>
            <Error404 />
          </MainLayout>
        } />


      </Routes>
    </div >
  );
}

export default App;
