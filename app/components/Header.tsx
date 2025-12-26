import Image from "next/image"

const Header = () => {
    return (
        <div className="mt-[26px] flex content-between justify-between w-full">
            <div className="title 
            flex items-center content-center gap-1.5">
                <Image src="music.svg" alt="" width={38} height={38}
                    className=" p-1.5 rounded-[8px] bg-gradient-to-br from-[#8b29f0] via-[#4a58f2] to-[#3db0ff]"
                />
                <h1 className="font-fb text-2xl">Music Stream</h1>
            </div>

            <div className="searcher 
            relative w-full max-w-[340px]">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Image
                        src="/search.svg"
                        alt="Search"
                        width={18}
                        height={18}
                        className="opacity-50"
                    />
                </div>

                <input
                    type="text"
                    placeholder="Поиск треков и исполнителей..."
                    className="w-full bg-grey text-white text-sm rounded-xl border border-gray-700 py-3 pl-10 pr-4 outline-none focus:border-blue-500 transition-colors placeholder:text-gray-500"
                />
            </div>
        </div>
    )
}

export default Header