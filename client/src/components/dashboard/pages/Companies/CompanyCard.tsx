import React, { useState } from "react";


interface CompanyCardProps {
    id: string;
    email: string;
    username: string;
    logo: string;
    name: string;
    noOfJobDescriptions: number;
    noOfCandidatesInvited: number;
    website: string;
    onDelete: (id: string) => Promise<void>;
}

const CompanyCard: React.FC<CompanyCardProps> = ({
    noOfCandidatesInvited,
    logo,
    id,
    noOfJobDescriptions,
    email,
    name,
    website,
    onDelete,
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="w-full max-w-[300px] bg-white border border-gray-200 rounded-lg shadow-sm relative">

            <div className="flex flex-col items-center justify-center px-2 pb-10">

                {/* Sample logo  */}
                <img src={logo} className="w-32 h-32" />

                <h5 className="mb-1 mt-2 text-xl text-center font-medium text-gray-900">{name}</h5>

                <span className="text-sm text-gray-500">{website}</span>
                <div className="text-sm text-gray-500">{email}</div>
                <span className="text-sm text-gray-500">No of assessments created:{noOfJobDescriptions}</span>
                <span className="text-sm text-gray-500">No of Candidates Invited:{noOfCandidatesInvited}</span>
                <div className="flex  p-2 mt-4 md:mt-6">
                    <a href={website.startsWith("http") ? website : `https://${website}`} target="_blank" rel="noopener noreferrer">
                        <button
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-primary rounded-lg hover:bg-primary/80"
                        >
                            View Company
                        </button>
                    </a>

                    <button
                        onClick={() => onDelete(id)}
                        className="py-2 px-4 ms-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg border border-gray-200 focus:z-10 focus:ring-4"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompanyCard;