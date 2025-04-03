import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import apiRoutes from '../utils/apiRoutes';
import { enqueueSnackbar } from 'notistack';
import { format } from 'date-fns';
import Spinner from '../components/common/Spinner';
import { Link, useNavigate } from 'react-router-dom';

interface JobDescription {
  _id: string;
  title: string;
  quizDuration: number;
  noOfInterviewQuestions: number;
  createdAt: string;
}

const Assessments: React.FC = () => {
  const navigate = useNavigate();
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [filteredResults, setFilteredResults] = useState<JobDescription[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const getJobDescriptions = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(apiRoutes.getMyJobDescriptions);
        setJobDescriptions(response.data.data);
        setFilteredResults(response.data.data); // Initialize search results with full data
      } catch (error) {
        console.log(error);
        enqueueSnackbar("An error occurred fetching the assessments", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };
    getJobDescriptions();
  }, []);

  // Handle search input changes with debouncing
  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setFilteredResults(jobDescriptions); // Reset to all assessments when search is empty
        return;
      }
      try {
        const response = await axiosInstance.get(apiRoutes.searchAssessment(query));
        setFilteredResults(response.data.data);
      } catch (error) {
        console.error("Error fetching search results", error);
        enqueueSnackbar("Error fetching search results", { variant: "error" });
      }
    };

    const delayDebounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(delayDebounce);
  }, [query, jobDescriptions]);

  return (
    <div className="min-h-screen bg-transparent p-6 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-200">Assessments</h1>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <button className="bg-primary hover:opacity-85 text-white font-semibold px-5 py-2 rounded-md w-full md:w-auto">
            <Link to={'/create-assessment'}>Create Assessments +</Link>
          </button>
        </div>
      </div>

      {/* Filters and Search Section */}
      <div className="flex text-black flex-col md:flex-row items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by title"
          className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

      </div>

      {loading ? (
        <div className='h-60'><Spinner /></div>
      ) : filteredResults.length === 0 ? (
        <div className="text-center p-4 text-gray-400">
          You don't have any matching active assessments!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-transparent shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-transparent text-gray-700 text-left">
                <th className="p-4">Name</th>
                <th className="p-4">Quiz duration</th>
                <th className="p-4">Number of interview questions</th>
                <th className="p-4">Created On</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((assessment) => (
                <tr
                  key={assessment._id}
                  className="border-b hover:bg-gray-700 cursor-pointer transition-all duration-150"
                  onClick={() => navigate(`/assessment/${assessment._id}`)}
                >
                  <td className="p-4">{assessment.title}</td>
                  <td className="p-4 text-center">{assessment.quizDuration}</td>
                  <td className="p-4 text-center">{assessment.noOfInterviewQuestions}</td>
                  <td className="p-4">{format(new Date(assessment.createdAt), "dd-MM-yyyy")}</td>
                  <td className="p-4 text-right">
                    <button className="text-gray-500 hover:text-gray-800">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Assessments;
