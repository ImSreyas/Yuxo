import Image from "next/image"
import Map from "./Map"

const LoginCover = () => {
  return (
      <div className="hidden bg-muted lg:block lg:col-span-3">
        {/* <Image
          src="/map.png"
          alt=" "
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        /> */}
        <Map />
      </div>
  )
}

export default LoginCover