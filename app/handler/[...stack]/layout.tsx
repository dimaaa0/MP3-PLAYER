// app/handler/[...stack]/page.tsx
import { StackHandler } from "@stackframe/stack";
import { stackClientApp } from "../../../stack/client";
import Link from "next/link";

export default function Handler(props: any) {
    return (
        <div className=" min-h-screen text-black bg-white flex flex-col items-center justify-center">
            <StackHandler app={stackClientApp} {...props} />
        </div>
    )
};
