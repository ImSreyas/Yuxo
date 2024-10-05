import Image from "next/image"
import Login from "./components/Login"

export default function page() {
  return (
    <div className="w-full flex justify-center items-center min-h-screen">
      <Login />
    </div>
  )
}
