import React from "react";
import { Link } from "react-router-dom";
import FadeIn from "../components/common/FadeIn";

const UnauthorizedAccess: React.FC = () => {
  return (
    <FadeIn duration={200}>

      <div className="flex flex-col items-center justify-center min-h-screen bg-richblack-900 text-gray-100">
        <h1 className="text-6xl font-extrabold text-red-600">403</h1>
        <h2 className="text-2xl font-bold mt-4">Access Denied</h2>
        <p className="text-lg text-gray-100 mt-2 text-center max-w-md">
          You do not have permission to access this page. Please contact the
          administrator if you believe this is an error.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg shadow-md hover:bg-red-500"
          >
            Go Back Home
          </Link>
        </div>
        <div className="absolute top-10 left-10">
          <svg
            className="w-16 h-16 text-red-600 animate-pulse"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 18.364A9 9 0 115.636 5.636a9 9 0 0112.728 12.728zM12 8v4m0 4h.01"
            />
          </svg>
        </div>
      </div>
    </FadeIn>
  );
};

export default UnauthorizedAccess;
