import SignUp from "./components/SignUp"
import SignUpCover from "./components/SignUpCover"

const page = () => {
    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-5 xl:min-h-screen">
          <SignUpCover />
          <SignUp />
        </div>
    )
}

export default page