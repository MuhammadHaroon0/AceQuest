import React, { useState } from "react";

interface StudentCardProps {
    id: string;
    name: string;
    email: string;
    subscription: string;
    photoUrl: string;
    noOfJobDescriptions: number;
    onDelete: (id: string) => Promise<void>;
}

const StudentCard: React.FC<StudentCardProps> = ({
    name,
    id,
    email,
    subscription,
    noOfJobDescriptions,
    photoUrl,
    onDelete,
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="w-full max-w-[270px] bg-white border border-gray-200 rounded-lg shadow-sm relative">

            <div className="flex flex-col items-center pb-10">
                <img
                    className="w-24 h-24 mb-3 rounded-full shadow-lg"
                    src={photoUrl}
                    alt={name}
                />
                <h5 className="mb-1 text-xl font-medium text-gray-900">{name}</h5>
                <span className="text-sm text-gray-500">{email}</span>
                <span className="text-sm text-gray-500">Subscribed:{subscription ? "Yes" : "No"}</span>
                <span className="text-sm text-gray-500">No of assessments created:{noOfJobDescriptions}</span>
                <div className="flex mt-4 mx-2 md:mt-6">

                    <button
                        onClick={() => onDelete(id)}
                        className="py-2 px-4 ms-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg border border-gray-200"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentCard;