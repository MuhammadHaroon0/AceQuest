import HighlightText from "./HighlightText";

const stats = [
    { count: "5K", label: "Active Students" },
    { count: "10+", label: "Mentors" },
    { count: "200+", label: "Partners" },
    { count: "50+", label: "Awards" },
];

const Stats = () => {
    return (
        <section className="w-full flex flex-col justify-center items-center md:px-16 gap-6">

            <div className='text-white text-4xl md:text-4xl xl:text-5xl leading-snug text-center font-semibold'>
                A Journey of
                <HighlightText text="17 years" direction="bg-gradient-to-b" gradient="from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB]" />
                with
                <HighlightText text="100+ tech" direction="bg-gradient-to-b" gradient="from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB]" />
                partnerships
            </div>
            <div className='w-fit grid grid-cols-2 lg:grid-cols-4 gap-14 bg-richblack-700 justify-center p-12 md:p-8 rounded-2xl'>
                {
                    stats.map((data, index) => (
                        <div key={index} className=' flex flex-col items-center'>
                            <h1 className=' font-bold text-3xl lg:text-4xl text-white'>
                                {data.count}
                            </h1>
                            <h2 className=' text-center font-normal text-white'>
                                {data.label}
                            </h2>
                        </div>
                    ))
                }
            </div>
        </section>
    )
}

export default Stats