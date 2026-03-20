import prisma from '@/lib/db'

export async function Prisma() {
    const posts = await prisma.post.findMany()

    return (
        <div className='mx-4 my-6 max-w-5xl'>
            <div className='mb-4 border-b border-slate-300 pb-2'>
                <h2 className='text-2xl font-semibold'>Prisma Data</h2>
                <p className='text-sm text-slate-600'>Your posts from the database, shown in responsive columns.</p>
            </div>

            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
                {posts.map((post) => (
                    <article key={post.id} className='rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md'>
                        <div className='text-xs text-slate-500'>ID: {post.id}</div>
                        <h3 className='mt-1 text-base font-medium text-slate-800'>{post.title || 'Untitled post'}</h3>
                        <h5 className='text-sm text-slate-500'>Date: {post.date.toLocaleDateString()}</h5>
                    </article>
                ))}
            </div>
        </div>
    )
}

export default Prisma
