import React from 'react'
import { SignUp } from '@stackframe/stack'
import Link from 'next/link'

const page = () => {
    return (
        <div className='min-h-screen flex items-center justify-center bg-[#ffffffee]'>
            <div className='text-black'>
                <SignUp />
            </div>
        </div>
    )
}

export default page