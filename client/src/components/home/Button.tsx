import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
    children: ReactNode;
    active: boolean;
    linkto: string;
}

const Button: React.FC<ButtonProps> = ({ children, active, linkto }) => {
    return (
        <Link to={linkto}>
            <div className={`text-center text-[15px] px-9 py-3 font-semibold 
                ${active ? "bg-gradient-to-r from-[#1ECDF8] to-[#7acbe1] text-richblack-5" : "bg-richblack-800"}
                hover:scale-95 transition-all duration-200`}
            >
                {children}
            </div>
        </Link>
    );
};

export default Button;
