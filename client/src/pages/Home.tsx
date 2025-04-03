import Stats from '../components/home/Stats';
import CodeBlock from '../components/home/CodeBlock'
import HighlightText from '../components/home/HighlightText'
import TechStack from '../components/home/TechStack';
import Services from '../components/home/Services';
import LearningGrid from '../components/home/LearningGrid';
import FadeIn from '../components/common/FadeIn';

const Home = () => {
    return (
        <div className='flex flex-col gap-12'>
            <div className='relative bg-richblack-900 mx-auto flex flex-col max-w-maxContent w-11/12 items-center text-white justify-between'>
                <FadeIn duration={200}>
                    <CodeBlock
                        position="lg:flex-row"
                        heading={
                            <div className='text-4xl md:text-5xl xl:text-6xl leading-snug font-semibold'>
                                Accelerate your
                                <HighlightText text=" career journey " direction="bg-gradient-to-b" gradient="from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB]" />
                                with our AI Job Platform
                            </div>
                        }
                        subheading="Prepare for your dream job with personalized quizzes, real-time interview simulations, and comprehensive performance reports. Our AI-driven platform is designed to enhance your interview skills and boost your confidence."
                        ctnbtn1={{
                            btnText: "Get Started",
                            linkto: "/signup",
                            active: true,
                        }}
                        ctnbtn2={{
                            btnText: "Explore Features",
                            linkto: "/login",
                            active: false,
                        }}
                        codeblock={`<html>
                                <head>
                                    <title>AI Job Platform</title>
                                </head>
                                <body>
                                    <h1><a href="/">AI Job Platform</a></h1>
                                    <nav>
                                        <a href="one/">Generate Quizzes</a>
                                        <a href="two/">Real-time Interviews</a>
                                        <a href="three/">Performance Reports</a>
                                        </nav>
                                        </body>
                                        </html>
                                        `}
                        codeColor="text-yellow-25"
                        backgroundGradient={<div className='codeblock2 absolute'></div>}
                    />

                </FadeIn>
            </div>
            <FadeIn >

                <Stats />
            </FadeIn>
            <TechStack />
            <LearningGrid />

            <Services />

        </div >
    );
}

export default Home;
