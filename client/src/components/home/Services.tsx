import React from "react";
import video from '../../assets/tech.mp4'
const Services: React.FC = () => {
    return (
        <div className="mx-auto mt-8">
            <div className="flex items-center flex-wrap relative text-white p-8">
                {/* Left Section */}
                <video
                    className="absolute opacity-50 top-0 left-0 w-full h-full object-cover"
                    src={video} // Replace with your video path
                    autoPlay
                    loop
                    muted
                    playsInline
                />
                <div className="relative z-10 w-full h-full md:w-1/2">
                    <div className="h-full title-wrap relative lg:pl-16 lg:px-8">
                        <small className=" uppercase tracking-wide relative z-10 ">Services</small>
                        {/* <img
                            className="absolute top-0 left-0 opacity-50 animate-fadeInLeft"
                            src=""
                            alt="Shape"
                        /> */}
                        <h2
                            className="text-4xl lg:text-5xl font-medium gradient-with-scroll leading-tight "
                            style={{ "--gradient-position": "100%" } as React.CSSProperties}
                        >
                            Prioritizing usability, scalability, and security while integrating third-party AI tools for natural language processing and facial expression analysis.
                        </h2>
                    </div>
                </div>

                {/* Right Section */}
                <div className="w-full relative z-10 md:w-1/2 p-4 border-l border-gray-300">
                    <ul className="">
                        {/* Service Item 1 */}
                        <li className="animate-fadeInUp border-b mb-4 pb-5">
                            <h3 className="text-xl font-semibold">Job-Specific Assessments</h3>
                            <div className="description  mt-2">
                                Students and Company Stakeholders will be able to submit job descriptions using the system, and it will create relevant quizzes and exercises.
                            </div>
                            <a
                                href="#"
                                className="mt-2 inline-flex items-center hover:underline"
                            >
                                Learn more
                                <span className="ml-1">&rarr;</span>
                            </a>
                        </li>

                        {/* Service Item 2 */}
                        <li className="animate-fadeInUp border-b mb-4 pb-5">
                            <h3 className="text-xl font-semibold">Real-Time AI Interview</h3>
                            <div className="description mt-2">
                                The system shall conduct real-time AI-driven interviews (audio or video), asking questions and analyzing student responses, emotions, and confidence
                                in real-time.
                            </div>
                            <a
                                href="#"
                                className=" mt-2 inline-flex items-center hover:underline"
                            >
                                Learn more
                                <span className="ml-1">&rarr;</span>
                            </a>
                        </li>

                        {/* Service Item 3 */}
                        <li className="animate-fadeInUp">
                            <h3 className="text-xl font-semibold">Performance Report Generation</h3>
                            <div className="description mt-2">
                                The system shall generate detailed performance reports for students after quizzes and interviews, displaying metrics like correctness, confidence score, and emotions.
                            </div>
                            <a
                                href="#"
                                className="mt-2 inline-flex items-center hover:underline"
                            >
                                Learn more
                                <span className="ml-1">&rarr;</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Services;
