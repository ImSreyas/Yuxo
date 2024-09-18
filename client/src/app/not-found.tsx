import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className='min-h-screen flex gap-4 justify-center items-center flex-col text-center p-4'>
      <div className='text-3xl sm:text-4xl font-bold'>
        404 Page not found
      </div>
      <div className='text-muted-foreground max-w-[600px]'>
        Oops! The page you're looking for seems to have wandered off. 
      </div>
      <div className='py-3'>
        <Link href="/">
          <Button>
            Go to Homepage
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default page