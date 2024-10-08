import SignUp from "./components/SignUp"
import SignUpCover from "./components/SignUpCover"

const page = () => {
  return (
    <div className="w-full lg:grid lg:grid-cols-5 h-screen">
      <SignUp />
      <SignUpCover />
    </div>
  )
}

export default page