import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function POST() {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const posts = await prisma.post.createMany({
        data: Array.from({ length: 1 }).map((_, i) => ({
            userId: user.id,
            name: `Post ${i + 1}`,
            createdAt: new Date(Date.now() - i * 1000 * 60 * 60 * 24),
            randomNumber: Number(Math.random().toFixed(0)),
        }))
    })

    return NextResponse.json(posts)
}