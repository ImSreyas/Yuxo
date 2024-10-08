import Image from "next/image"
import Login from "./components/Login"
import LoginCover from "./components/LoginCover"

export default function page() {
  return (
    <div className="w-full lg:grid lg:grid-cols-5 min-h-screen">
      <LoginCover />
      <Login />
    </div>
  )
}
