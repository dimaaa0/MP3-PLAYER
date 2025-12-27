import Image from "next/image"
import { Search } from "lucide-react"

const Header = () => {
    return (
        <div className="mt-6.5 flex content-between justify-between w-full">
            <div className="title 
            flex items-center content-center gap-1.5">
                <Image src="music.svg" alt="" width={38} height={38}
                    className=" p-1.5 rounded-lg bg-[#3b33339a]"
                />
                <h1 className="font-fb text-2xl text-white">Music Stream</h1>
            </div>

            <div className="searcher text-white font-fr relative w-full max-w-85">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Search
                        className="absolute left-2.5 width={16} height={16}"
                    />
                </div>

                <input
                    type="text"
                    placeholder="Enter the name of the artist of the song"
                    className="w-full bg-[#0000003b] font-fr text-[14px] text-white text-sm rounded-xl border py-3 pl-10 pr-4 outline-none transition-colors placeholder:text-white"
                />
            </div>
        </div >
    )
}

export default Header