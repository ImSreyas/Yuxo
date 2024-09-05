import Image from "next/image"
import Login from "./components/Login"
import LoginCover from "./components/LoginCover"

export const description =
  "A login page with two columns. The first column has the login form with email and password. There's a Forgot your passwork link and a link to sign up if you do not have an account. The second column has a cover image."

export default function page() {
  return (
    <div className="w-full lg:grid lg:grid-cols-5 min-h-screen">
      <LoginCover />
      <Login />
    </div>
  )
}
