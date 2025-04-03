
// import ContactFormSection from '../components/core/AboutPage/ContactFormSection'
import { IoMdChatbubbles } from "react-icons/io"
import { BsGlobeCentralSouthAsia, BsFillTelephoneFill } from "react-icons/bs"
import ContactUsForm from '../components/contact/ContactUsForm'
import FadeIn from "../components/common/FadeIn"
// import Footer from '../components/common/Footer'
// import ReviewSlider from '../components/common/ReviewSlider'

const ContactUs = () => {
    return (
        <div>
            {/* Upper section */}
            <div className=' text-white w-11/12 mx-auto lg:py-24 py-12 flex flex-col gap-8  lg:flex-row justify-between'>

                <div className='flex flex-col gap-12 bg-richblack-800 h-fit p-8 w-full lg:w-5/12 items-start rounded-2xl shadow-lg transform transition-all hover:shadow-xl contactBox'>
                    <div className='flex gap-4 items-start'>
                        <IoMdChatbubbles size={30} className=' bg-richblack-900 p-2 rounded-full' />
                        <div>
                            <p className='text-richblack-5 text-[20px] font-bold'>Chat with Us</p>
                            <p className='text-richblack-200 text-sm'>Our friendly team is here to help.</p>
                            <p className='text-richblack-100 text-sm font-semibold underline cursor-pointer hover:text-blue-200 transition-colors'>contact@company.com</p>
                        </div>
                    </div>

                    <div className='flex gap-4 items-start'>
                        <BsGlobeCentralSouthAsia size={30} className=' bg-richblack-900 p-2 rounded-full' />
                        <div>
                            <p className='text-richblack-5 text-[20px] font-bold'>Visit Us</p>
                            <p className='text-richblack-200 text-sm'>Come say hello at our office HQ.</p>
                            <p className='text-richblack-100 text-sm font-semibold underline cursor-pointer hover:text-blue-200 transition-colors'>123 Main St, City</p>
                        </div>
                    </div>

                    <div className='flex gap-4 items-start'>
                        <BsFillTelephoneFill size={30} className=' bg-richblack-900 p-2 rounded-full' />
                        <div>
                            <p className='text-richblack-5 text-[20px] font-bold'>Call Us</p>
                            <p className='text-richblack-200 text-sm'>Mon - Fri, 8am to 5pm</p>
                            <p className='text-richblack-100 text-sm font-semibold'>+123 456 7890</p>
                        </div>
                    </div>
                </div>

                <FadeIn duration={200}>

                    <div className='flex flex-col gap-2 lg:p-12 p-5 shadow-blue-200 shadow-[0px_0px_12px_0px] rounded-2xl '>
                        <h1 className=' font-semibold text-[36px] text-richblack-5'>Got a Idea? We’ve got the skills. Let’s team up</h1>
                        <p className='mb-10 text-richblack-300'>Tall us more about yourself and what you’re got in mind.</p>
                        <ContactUsForm />
                    </div>
                </FadeIn>
            </div>
        </div>
    )
}

export default ContactUs