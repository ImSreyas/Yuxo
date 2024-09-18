import Link from "next/link"

const TermsAndConditions = () => {
  return (
    <div className="text-sm text-gray-500 text-center mt-7 font-medium">
      By clicking Sign Up, you agree to our <Link href="" className="underline hover:text-primary">Terms of Service</Link> and <Link href="" className="underline hover:text-primary" >Privacy Policy</Link>.
    </div>
  )
}

export default TermsAndConditions