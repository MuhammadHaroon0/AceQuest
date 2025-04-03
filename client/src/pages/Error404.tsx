import React from "react";
import FadeIn from "../components/common/FadeIn";

const Error404: React.FC = () => {
  return (
    <FadeIn duration={200}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-richblack-900 text-gray-100">

        <h1 className="text-6xl font-extrabold text-primary">404</h1>
        <h2 className="text-2xl font-bold mt-4">Oops! Page Not Found</h2>
        <p className="text-lg mt-2 text-center max-w-md">
          The page you're looking for doesn't exist. It might have been removed,
          renamed, or is temporarily unavailable.
        </p>
        <div className="mt-6">
          <a
            href="/"
            className="px-6 py-3 bg-primary text-white font-medium rounded-lg shadow-md hover:bg-primary/80"
          >
            Go Back Home
          </a>
        </div>
        <div className="absolute top-10 left-10">
          <svg
            className="w-16 h-16 text-primary animate-bounce"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m0-4h.01M21 12.35A8.948 8.948 0 0118 18a8.96 8.96 0 01-6 2 8.96 8.96 0 01-6-2 8.948 8.948 0 01-3-5.65 8.95 8.95 0 013-5.65A8.96 8.96 0 0112 4a8.96 8.96 0 016 2c1.98 1.35 3 3.2 3 5.35z"
            />
          </svg>
        </div>
      </div>
    </FadeIn>
  );
};

export default Error404;
