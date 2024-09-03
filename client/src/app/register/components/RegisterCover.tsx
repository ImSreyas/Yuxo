import Image from "next/image"

const RegisterCover = () => {
  return (
      <div className="hidden bg-muted lg:block">
        <Image
          src="/placeholder.svg"
          alt=" "
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
  )
}

export default RegisterCover