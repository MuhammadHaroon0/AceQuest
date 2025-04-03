import React, { useState } from 'react'

import Spinner from '../common/Spinner';

import PerformanceModal from './PerformanceModal';
import { format } from 'date-fns';
interface AllCandidatesProps {
    assessmentId?: string
}
interface Candidate {
    _id: string;
    email: string;
    name: string;
    performance?: string;
    createdAt: string;
}
interface AllCandidatesProps {
    candidates: Candidate[];
    loading: boolean
}

const AllCandidates: React.FC<AllCandidatesProps> = ({ candidates, loading }) => {
    const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-lg font-semibold mb-4">All Candidates</h2>
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                {/* <input type="text" placeholder="Search" className="bg-gray-900 border border-gray-700 rounded-md px-4 py-2 w-full sm:w-1/2 md:w-1/4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <select className="bg-gray-900 border border-gray-700 rounded-md px-4 py-2 w-full sm:w-1/2 md:w-1/6 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Status</option>
                </select>
                <select className="bg-gray-900 border border-gray-700 rounded-md px-4 py-2 w-full sm:w-1/2 md:w-1/6 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Stage</option>
                </select>
                <select className="bg-gray-900 border border-gray-700 rounded-md px-4 py-2 w-full sm:w-1/2 md:w-1/6 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Grading</option>
                </select> */}
            </div>

            {/* Candidates Table */}
            {loading ?
                <Spinner /> :
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-700 text-gray-400">
                                <th className="p-4 text-sm">Email</th>
                                <th className="p-4 text-sm">Name</th>
                                <th className="p-4 text-sm">Invited On</th>
                                <th className="p-4 text-sm">Status</th>
                                <th className="p-4 text-sm"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {candidates?.length ? candidates.map((candidate: Candidate) => (

                                <tr key={candidate._id} className="border-b border-gray-700 hover:bg-gray-700">
                                    <td className="p-4 text-sm">{candidate.email}</td>
                                    <td className="p-4 text-sm">{candidate.name}</td>
                                    <td className="p-4 text-sm">{format(new Date(candidate.createdAt), "dd-MM-yyyy")}</td>


                                    <td className="p-4 text-green-400 text-sm">{candidate.performance ? 'Completed' : 'Pending'}</td>
                                    <td className="p-4 text-right">
                                        {candidate.performance && <button className='border border-primary text-white rounded-lg p-2 hover:bg-primary hover:text-black'
                                            onClick={() => setSelectedCandidateId(candidate._id)}
                                        >
                                            View Performance
                                        </button>}
                                    </td>
                                    <PerformanceModal
                                        username={candidate.email}
                                        isOpen={selectedCandidateId === candidate._id}
                                        closeModal={() => setSelectedCandidateId(null)}
                                        candidateId={candidate._id}
                                    />

                                </tr>
                            )) :
                                <div className='py-4'>No candidates added yet</div>}
                            {/* Additional rows */}
                        </tbody>
                    </table>
                </div>}
        </div>
    )
}



export default AllCandidates
