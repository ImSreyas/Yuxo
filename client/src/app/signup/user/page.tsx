import SignUp from "./components/SignUp"
import SignUpCover from "./components/SignUpCover"

const page = () => {
    return (
        <div className="lg:grid-cols-5 xl:min-h-screen w-full lg:grid lg:h-screen">
          <SignUpCover />
          <SignUp />
        </div>
    )
}

export default page