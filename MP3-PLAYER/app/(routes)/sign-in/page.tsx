import { SignIn } from '@stackframe/stack'
import Link from 'next/link'
import React from 'react'

const page = () => {
    return (
        <div className='min-h-screen flex items-center justify-center bg-[#ffffffee]'>
            <div className='flex justify-center flex-col items-center text-black'>
                <SignIn />
            </div>
        </div>
    )
}

export default page