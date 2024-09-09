import SignUp from "./components/SignUp"
import SignUpCover from "./components/SignUpCover"

const page = () => {
  return (
    <div className="w-full lg:grid min-h-screen lg:grid-cols-5">
      <SignUp />
      <SignUpCover />
    </div>
  )
}

export default page