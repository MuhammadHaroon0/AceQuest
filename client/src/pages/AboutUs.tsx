import BannerImage1 from '../assets/aboutus1.webp'
import BannerImage2 from '../assets/aboutus2.webp'
import BannerImage3 from '../assets/aboutus3.webp'
import HighlightText from '../components/home/HighlightText'
import Quote from '../components/about/Quote'
import ContactFormSection from '../components/about/ContactFormSection'
import Lottie from 'lottie-react'
import lottieAnimation from '../data/lottieAnimation.json'
import FadeIn from '../components/common/FadeIn'

const Aboutus = () => {
    return (
        <div className=' text-white'>


            {/* Section 1 */}
            <section className=' bg-richblack-800 pb-5 lg:pb-0'>

                <FadeIn duration={200}>
                    <div className='w-11/12 mx-auto pt-[60px] flex flex-col items-center justify-center'>


                        <header className='lg:w-[70%] mt-[50px] mb-[40px]  flex flex-col text-[36px] leading-snug font-semibold text-center items-center'>
                            Nurturing talent with AI driven workflows
                            <HighlightText text={"Real-Time AI Based Interview"} direction={"bg-gradient-to-b"} gradient={" from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB]"} />
                        </header>


                        <center className='text-center lg:w-2/3 text-richblack-300'>AceQuest is at the forefront of driving innovation in placements. We're passionate about creating a brighter future by offering cutting-edge assessments, leveraging emerging technologies, and nurturing a vibrant learning community.
                        </center>

                        <div className='grid lg:grid-cols-3 grid-cols-1 md:grid-cols-3 gap-6 mx-auto lg:mt-0 mt-10 lg:translate-y-14'>
                            <img alt='' src={BannerImage1} />
                            <img alt='' src={BannerImage2} />
                            <img alt='' src={BannerImage3} />
                        </div>


                    </div>
                </FadeIn>
            </section>

            {/* Section 2 */}
            <section>
                <FadeIn duration={200}>

                    <Quote />
                </FadeIn>
            </section>

            {/* Section 3 */}
            <section>
                <div className="flex flex-col border-t border-richblack-700">
                    {/* Founding Story Section */}
                    <div className="flex">
                        <div className="flex flex-col l lg:flex-row py-12 lg:px-32 px-5 lg:gap-24 gap-10">
                            {/* Text Section */}
                            <div className="lg:w-1/2 mt-6 lg:mt-20">
                                <h1 className="text-6xl text-center lg:text-left">
                                    <HighlightText
                                        text={"Real-Time Interview with AI"}
                                        direction={"bg-gradient-to-br"}
                                        gradient={"from-[#833AB4] via-[#FD1D1D] to-[#FCB045]"}
                                    />
                                </h1>
                                <p className="text-richblack-300 leading-relaxed mt-6 mb-4">
                                    Our e-learning platform was born out of a shared vision and passion for transforming education. It all began with a group of educators, technologists, and lifelong learners who recognized the need for accessible, flexible, and high-quality learning opportunities in a rapidly evolving digital world.
                                </p>
                                <p className="text-richblack-300">
                                    As experienced educators ourselves, we witnessed firsthand the limitations and challenges of traditional education systems. We believed that education should not be confined to the walls of a classroom or restricted by geographical boundaries. We envisioned a platform that could bridge these gaps and empower individuals from all walks of life to unlock their full potential.
                                </p>
                            </div>

                            {/* Animation Section with Adjusted Position and Responsiveness */}

                            <div className="max-h-[300px] mx-auto md:max-h-[300px] lg:max-h-[600px] w-full md:w-1/2 lg:max-w-[600px]">
                                <Lottie
                                    animationData={lottieAnimation}
                                    className="w-full h-full"
                                />
                            </div>


                        </div>
                    </div>

                    {/* Vision and Mission Section */}
                    <div className="flex flex-col lg:flex-row py-12 lg:px-32 px-5 lg:gap-24 gap-10">
                        {/* Vision Section */}
                        <div>
                            <h2 className="text-center lg:text-start">
                                <HighlightText text={"Our Vision"} direction={"bg-gradient-to-b text-[36px]"} gradient={"from-[#E65C00] to-[#F9D423]"} />
                            </h2>
                            <p className="text-richblack-300 mt-6">
                                With this vision in mind, we set out on a journey to create an e-learning platform that would revolutionize the way people learn. Our team of dedicated experts worked tirelessly to develop a robust and intuitive platform that combines cutting-edge technology with engaging content, fostering a dynamic and interactive learning experience.
                            </p>
                        </div>

                        {/* Mission Section */}
                        <div>
                            <h2 className="text-center lg:text-start">
                                <HighlightText text={"Our Mission"} direction={"bg-gradient-to-br text-[36px]"} gradient={"from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB]"} />
                            </h2>
                            <p className="text-richblack-300 mt-6">
                                Our mission goes beyond just delivering courses online. We wanted to create a vibrant community of learners, where individuals can connect, collaborate, and learn from one another. We believe that knowledge thrives in an environment of sharing and dialogue, and we foster this spirit of collaboration through forums, live sessions, and networking opportunities.
                            </p>
                        </div>
                    </div>
                </div>
            </section>



            {/* Section 4 */}
            {/* <Stats/> */}

            {/* Section 5 */}
            <section className=' mx-auto flex flex-col items-center justify-between gap-5 py-[90px]'>
                <ContactFormSection />
            </section>

            {/* Review Section */}


            {/* <Footer/> */}

        </div>
    )
}

export default Aboutus