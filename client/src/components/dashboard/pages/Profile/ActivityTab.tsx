import { format } from 'date-fns';
import React from 'react'
interface ActivityTabProps {
    accountType?: string;
    jobDescriptions?: string[];
    subscription?: string;
    createdAt?: string;
}
const ActivityTab: React.FC<ActivityTabProps> = ({ accountType, jobDescriptions, subscription, createdAt }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Assessments Created */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-50 rounded-full">
                        <svg
                            className="w-6 h-6 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Asessments</p>
                        <p className="text-xl font-semibold text-gray-900">{jobDescriptions?.length}</p>
                    </div>
                </div>
            </div>

            {/* Total Points */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-50 rounded-full">
                        <svg
                            className="w-6 h-6 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Joined Since</p>
                        {createdAt && <p className="text-lg font-semibold text-gray-900">{format(new Date(createdAt), "dd-MM-yyyy")}</p>}
                    </div>
                </div>
            </div>

            {/* Courses Created */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-purple-50 rounded-full">
                        <svg
                            className="w-6 h-6 text-purple-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Subscription</p>
                        <p className="text-lg font-semibold text-gray-900">{subscription ? "Active" : "Inactive"}</p>
                    </div>
                </div>
            </div>

            {/* Completed Tasks */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-orange-50 rounded-full">
                        <svg
                            className="w-6 h-6 text-orange-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Joined as</p>
                        {accountType && <p className="text-lg font-semibold text-gray-900">{accountType?.charAt(0).toUpperCase() + accountType?.slice(1)}</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ActivityTab