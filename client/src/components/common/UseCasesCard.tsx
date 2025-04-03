import { FaCube } from "react-icons/fa6";

const UseCasesCard = () => {
    return (
        <div className="bg-primary text-white rounded-lg p-6 shadow-md w-full">
            {/* Title */}
            <h3 className="text-2xl font-medium mb-2">Past Performances</h3>

            {/* Subtext */}
            <div className="flex items-center text-sm mb-4">
                <span className="mr-2">
                    <FaCube />
                </span>
                <p> 6 Past Assessments</p>
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center">
                <button className="bg-white text-primary rounded-md px-8 py-2 text-sm font-medium">
                    Expand
                </button>

            </div>
        </div>
    );
};

export default UseCasesCard;
