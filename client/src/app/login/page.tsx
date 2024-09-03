import Image from "next/image"
import Login from "./components/Login"
import LoginCover from "./components/LoginCover"

export const description =
  "A login page with two columns. The first column has the login form with email and password. There's a Forgot your passwork link and a link to sign up if you do not have an account. The second column has a cover image."

export default function page() {
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <LoginCover />
      <Login />
    </div>
  )
}
