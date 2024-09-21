import { PropsWithChildren } from "react"

const layout: React.FC<PropsWithChildren> = ({children}) => {
  return (
    <main className="">{children}</main>
  )
}

export default layout