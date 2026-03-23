import prisma from '@/lib/db'
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';

export async function Prisma() {

    const user = await getCurrentUser();
    const userId = user.id;
    console.log("Current user ID:", user.id, "Parsed userId:", userId);

    const totalAmount = await prisma.post.count(
        { where: { userId: userId } }
    );
    console.log("Total posts:", totalAmount);

    const posts = await prisma.post.findMany(
        { where: { userId: userId } }
    );
    console.log("Posts found:", posts.length);

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
                        <h3 className='mt-1 text-base font-medium text-slate-800'>{post.name || 'Untitled post'}</h3>
                        <h5 className='text-sm text-slate-500'>Date: {post.createdAt?.toLocaleDateString()}</h5>
                        <p className='text-stone-800'>Author ID: {post.userId}</p>
                    </article>
                ))}
            </div>
            <Link href='/'>Home</Link>
        </div>
    )
}

export default Prisma

//РАЗОБРАТЬСЯ КАК МНЕ ВИДЕТЬ МОИ СООБЩЕНИЯ ОТ МОЕЙ ПОЧТЫ И ПРОВЕРИТЬ ОСТАЛЬНЫЕ И РАБОТУ AUTHORID & USERID