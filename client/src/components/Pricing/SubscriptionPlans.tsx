import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import apiRoutes from "../../utils/apiRoutes";
import { enqueueSnackbar } from "notistack";
import axios from "axios";
import useAuthStore from "../../stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import FadeIn from "../common/FadeIn";
interface Plan {
    title: string;
    noOfJobDescriptionsAvailable: number;
    currentPeriodEnd: Date;
    noOfCandidatesAllowed?: number; // Optional, only for companies
    availableTo: string;
}
const SubscriptionPlans = () => {
    const [packageType, setPackageType] = useState("student");
    const { user } = useAuthStore()
    const studentPlans: Plan[] = [
        {
            title: "Free",
            noOfJobDescriptionsAvailable: 4,
            currentPeriodEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            availableTo: "student"
        },
        {
            title: "Advanced",
            noOfJobDescriptionsAvailable: 10000,
            currentPeriodEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
            availableTo: "student"
        },
    ];

    const companyPlans: Plan[] = [
        {
            title: "Free",
            noOfJobDescriptionsAvailable: 8,
            currentPeriodEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            noOfCandidatesAllowed: 8,
            availableTo: "company"
        },
        {
            title: "Advanced",
            noOfJobDescriptionsAvailable: 10000,
            currentPeriodEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            noOfCandidatesAllowed: 10000,
            availableTo: "company"
        },
    ];

    const navigate = useNavigate()

    const handleSubscribe = async (plan: Plan) => {
        if (!user) {
            enqueueSnackbar("You must login first")
            navigate('/login')
            return
        }
        try {
            const response = await axiosInstance.post(apiRoutes.subscribe, plan)
            console.log(response);

            enqueueSnackbar(response.data.data.message)
            setTimeout(() => {
                navigate('/create-assessment')
            }, 1500);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                enqueueSnackbar(error.response?.data?.message || "An error occurred");
            } else {
                enqueueSnackbar("An unexpected error occurred");
            }

        }
    }
    const flag = user ? user?.accountType : "both"
    return (
        <div>
            <section className="">
                <div className="py-8 mx-auto max-w-screen-xl lg:py-16">
                    {
                        !user && <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
                            <PricingToggle packageType={packageType} setPackageType={setPackageType} />
                        </div>
                    }
                    <FadeIn>

                        <div className="sm:grid-cols-2 grid gap-3">
                            {
                                (flag === "student" || (flag === 'both' && packageType === 'student')) &&
                                <>
                                    <div className="flex flex-col p-6 mx-auto max-w-lg gap-3 text-white bg-richblack-800 rounded-lg border border-gray-300 w-full">
                                        <div className="w-fit px-3 py-1 text-xs font-medium text-white  border shadow-sm rounded-md">
                                            Starter
                                        </div>
                                        <h3 className="text-2xl font-semibold">Free</h3>
                                        <p className="font-normal sm:text-sm ">Basic Starter Pack.</p>
                                        <hr />
                                        <ul role="list" className="mb-7 space-y-4 text-left">
                                            <li className="flex items-center space-x-3">
                                                <svg className="flex-shrink-0 w-5 h-5 text-gray-400 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                                                <span className="text-sm">You'll be able to create a maximium of 4 assessments</span>
                                            </li>
                                            <li className="flex items-center space-x-3">
                                                <svg className="flex-shrink-0 w-5 h-5 text-gray-400 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                                                <span className="text-sm">This plan will expire after 1 year</span>
                                            </li>
                                        </ul>

                                        <button className="w-full text-white rounded-full bg-primary hover:opacity-75 py-1 mb-4"
                                            onClick={() => handleSubscribe(studentPlans[0])}>Get Started</button>

                                        <ul role="list" className="mb-2 space-y-4 text-left">
                                            <li className="flex items-center space-x-3">
                                                <svg className="flex-shrink-0 w-5 h-5 text-gray-400 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                                                <span className="text-sm">Individual configuration</span>
                                            </li>
                                            <li className="flex items-center space-x-3">
                                                <svg className="flex-shrink-0 w-5 h-5 text-gray-400 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                                                <span className="text-sm">No setup, or hidden fees</span>
                                            </li>

                                            <li className="flex items-center space-x-3">
                                                <svg className="flex-shrink-0 w-5 h-5 text-gray-400 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                                                <span className="text-sm">Premium support: <span className="text-sm">6 months</span></span>
                                            </li>
                                            <li className="flex items-center space-x-3">
                                                <svg className="flex-shrink-0 w-5 h-5 text-gray-400 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                                                <span className="text-sm">Free updates: <span className="text-sm" >6 months</span></span>
                                            </li>
                                        </ul>

                                    </div>


                                    <div className="flex flex-col p-6 mx-auto max-w-lg w-full gap-3 text-white bg-sky-500 rounded-lg border border-gray-300 ">
                                        <div className="w-fit px-3 py-1 text-xs font-medium text-white  border shadow-sm rounded-md bg-richblack-700">
                                            Advanced
                                        </div>
                                        <h3 className="text-2xl font-semibold">100 $</h3>
                                        <p className="font-normal sm:text-sm">Our most advance feature rich pack for bulk generation. </p>
                                        <hr />
                                        <ul role="list" className="mb-8 space-y-4 text-left">
                                            <li className="flex items-center space-x-3">
                                                <svg className="flex-shrink-0 w-5 h-5 text-white " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                                                <span className="text-sm">You'll be able to create 10,000s assessments</span>
                                            </li>
                                            <li className="flex items-center space-x-3">
                                                <svg className="flex-shrink-0 w-5 h-5 text-white " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                                                <span className="text-sm">This plan will expire after 2 years</span>
                                            </li>
                                        </ul>

                                        <button className="w-full text-white rounded-full bg-richblack-800 hover:bg-richblack-600 py-1 mb-4"
                                            onClick={() => handleSubscribe(studentPlans[1])}>Get started</button>

                                        <ul role="list" className="mb-8 space-y-4 text-left">
                                            <li className="flex items-center space-x-3">
                                                <svg className="flex-shrink-0 w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                                                <span className="text-sm">Individual configuration</span>
                                            </li>
                                            <li className="flex items-center space-x-3">
                                                <svg className="flex-shrink-0 w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                                                <span className="text-sm">No setup, or hidden fees</span>
                                            </li>

                                            <li className="flex items-center space-x-3">
                                                <svg className="flex-shrink-0 w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                                                <span className="text-sm">Premium support: <span className="text-sm">6 months</span></span>
                                            </li>
                                            <li className="flex items-center space-x-3">
                                                <svg className="flex-shrink-0 w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                                                <span className="text-sm">Free updates: <span className="text-sm" >6 months</span></span>
                                            </li>
                                        </ul>
                                    </div>
                                </>}

                            {(flag === 'company' || (flag === 'both' && packageType === 'company')) &&

                                <>
                                    <div className="flex flex-col p-6 mx-auto max-w-lg gap-3 text-white bg-richblack-800 rounded-lg border border-gray-300 w-full">
                                        <div className="w-fit px-3 py-1 text-xs font-medium text-white  border shadow-sm rounded-md">
                                            Starter
                                        </div>
                                        <h3 className="text-2xl font-semibold">Free</h3>
                                        <p className="font-normal sm:text-sm ">Basic Starter Pack.</p>
                                        <hr />
                                        <ul role="list" className="mb-7 space-y-4 text-left">
                                            <li className="flex items-center space-x-3">
                                                <svg className="flex-shrink-0 w-5 h-5 text-gray-400 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                                                <span className="text-sm">You'll be able to create a maximum of assessments</span>
                                            </li>
                                            <li className="flex items-center space-x-3">
                                                <svg className="flex-shrink-0 w-5 h-5 text-gray-400 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                                                <span className="text-sm">This plan will expire after 1 year</span>
                                            </li>
                                            <li className="flex items-center space-x-3">
                                                <svg className="flex-shrink-0 w-5 h-5 text-gray-400 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                                                <span className="text-sm">You'll be able to invite a maximum of 8 candidates for assessments</span>
                                            </li>
                                        </ul>

                                        <button className="w-full text-white rounded-full bg-primary hover:opacity-75 py-1 mb-4"
                                            onClick={() => handleSubscribe(companyPlans[0])}>Get Started</button>

                                        <ul role="list" className="mb-2 space-y-4 text-left">
                                            <li className="flex items-center space-x-3">
                                                <svg className="flex-shrink-0 w-5 h-5 text-gray-400 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                                                <span className="text-sm">Team configuration</span>
                                            </li>
                                            <li className="flex items-center space-x-3">
                                                <svg className="flex-shrink-0 w-5 h-5 text-gray-400 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                                                <span className="text-sm">No setup, or hidden fees</span>
                                            </li>

                                            <li className="flex items-center space-x-3">
                                                <svg className="flex-shrink-0 w-5 h-5 text-gray-400 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                                                <span className="text-sm">Premium support: <span className="text-sm">6 months</span></span>
                                            </li>
                                            <li className="flex items-center space-x-3">
                                                <svg className="flex-shrink-0 w-5 h-5 text-gray-400 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                                                <span className="text-sm">Free updates: <span className="text-sm" >6 months</span></span>
                                            </li>
                                        </ul>

                                    </div>

                                    <div className="relative flex flex-col p-6 mx-auto w-full gap-3 text-white max-w-lg bg-gradient-to-tl from-white via-sky-500 to-sky-500 rounded-lg border-2 border-blue-300 ">
                                        <span className="mt-2 absolute right-1 top-0 px-3 py-1 text-xs font-medium text-white bg-blue-200 border shadow-sm rounded-md">
                                            {"Popular"}
                                        </span>
                                        <div className="w-fit px-3 py-1 text-xs font-medium text-white  border shadow-sm rounded-md bg-richblack-800">
                                            Advanced
                                        </div>
                                        <h3 className="text-2xl font-semibold">$ 1050 <span className="text-xs font-normal text-gray-500">
                                            / per year
                                        </span>
                                        </h3>
                                        <p className="font-normal sm:text-sm ">Our premium plan dor your business</p>
                                        <hr />
                                        <ul role="list" className="mb-2 space-y-4 text-left">
                                            <li className="flex items-center space-x-3">
                                                <svg className="flex-shrink-0 w-5 h-5 text-gray-400 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                                                <span className="text-sm">You'll be able to create 10,000 assessments</span>
                                            </li>
                                            <li className="flex items-center space-x-3">
                                                <svg className="flex-shrink-0 w-5 h-5 text-gray-400 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                                                <span className="text-sm">This plan will expire after 1 year</span>
                                            </li>
                                            <li className="flex items-center space-x-3">
                                                <svg className="flex-shrink-0 w-5 h-5 text-gray-400 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                                                <span className="text-sm">You'll be able to invite 10,000 candidates for assessments</span>
                                            </li>
                                        </ul>

                                        <button className="w-full text-white rounded-full bg-richblack-800 hover:opacity-75 py-1 mb-4"
                                            onClick={() => handleSubscribe(companyPlans[1])}>Subscribe</button>


                                        <ul role="list" className="mb-8 space-y-4 text-left">
                                            <li className="flex items-center space-x-3">
                                                <svg className="flex-shrink-0 w-5 h-5 text-gray-400 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                                                <span className="text-sm">Enterprise configuration</span>
                                            </li>
                                            <li className="flex items-center space-x-3">
                                                <svg className="flex-shrink-0 w-5 h-5 text-gray-400 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                                                <span className="text-sm">No setup, or hidden fees</span>
                                            </li>

                                            <li className="flex items-center space-x-3">
                                                <svg className="flex-shrink-0 w-5 h-5 text-gray-400 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                                                <span className="text-sm">Premium support: <span className="text-sm">6 months</span></span>
                                            </li>
                                            <li className="flex items-center space-x-3">
                                                <svg className="flex-shrink-0 w-5 h-5 text-gray-400 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                                                <span className="text-sm">Free updates: <span className="text-sm" >6 months</span></span>
                                            </li>
                                        </ul>

                                    </div>



                                </>

                            }
                        </div>
                    </FadeIn>
                </div>
            </section>
        </div>
    )


}

interface PricingToggleProps {
    packageType: string;
    setPackageType: (packageType: string) => void;

}
const PricingToggle: React.FC<PricingToggleProps> = ({ packageType, setPackageType }) => {

    return (
        <div className="flex items-center justify-center">
            <div className="flex gap-4 items-center bg-gray-700 rounded-xl p-1">
                {/* Monthly Option */}
                <button
                    className={`py-2 px-4 rounded-xl font-medium ${packageType === "student"
                        ? 'bg-richblack-800 text-white shadow-md'
                        : 'text-gray-400'
                        }`}
                    onClick={() => setPackageType("student")}
                >
                    For Students
                </button>

                {/* Yearly Option */}
                <div className="relative">
                    <button
                        className={`py-2 px-4 rounded-xl font-medium ${packageType === "company"
                            ? 'bg-richblack-800 text-white shadow-md'
                            : 'text-gray-400'
                            }`}
                        onClick={() => setPackageType("company")}
                    >
                        For Companies
                    </button>

                    <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 text-xs bg-primary text-white py-1 px-2 rounded-xl">
                        Save 30%
                    </span>

                </div>
            </div>
        </div>
    );
};






export default SubscriptionPlans
