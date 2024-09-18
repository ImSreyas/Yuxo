import { PropsWithChildren } from "react"

const layout: React.FC<PropsWithChildren> = ({children}) => {
  return (
    <main className="px-6 sm:px-8 md:px-10 lg:px-16">{children}</main>
  )
}

export default layout