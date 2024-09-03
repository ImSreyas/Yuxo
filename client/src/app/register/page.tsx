import Register from "./components/Register"
import RegisterCover from "./components/RegisterCover"

const page = () => {
    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-[800px]">
          <RegisterCover />
          <Register />
        </div>
    )
}

export default page