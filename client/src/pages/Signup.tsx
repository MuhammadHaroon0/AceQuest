import Template from '../components/auth/Template'
// import loginImg from '../assets/Images/login.webp'
import signupImg from "../assets/auth.png"

const Signup = () => {

  return (
    <Template
      title="Join the millions learning to code with StudyNotion for free"
      description1="Build skills for today, tomorrow, and beyond."
      description2="Education to future-proof your career."
      image={signupImg}
      formType="signup"
    />
  )
}

export default Signup