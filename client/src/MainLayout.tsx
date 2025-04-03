import React from "react";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/Footer";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="bg-richblack-900 text-richblack-25">
            <Navbar />
            <main>{children}</main>
            <Footer />
        </div>
    );
};

export default MainLayout;
