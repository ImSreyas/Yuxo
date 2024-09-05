import Register from "./components/Register"
import RegisterCover from "./components/RegisterCover"

const page = () => {
  return (
    <div className="w-full lg:grid min-h-screen lg:grid-cols-5">
      <Register />
      <RegisterCover />
    </div>
  )
}

export default page