import Register from "./components/Register"
import RegisterCover from "./components/RegisterCover"

const page = () => {
    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-5 xl:min-h-screen">
          <RegisterCover />
          <Register />
        </div>
    )
}

export default page