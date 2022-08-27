import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react";

export default function Nav(props) {
    const { data: session } = useSession();
    const { names, links } = props;
    return (
        <nav className="h-16 px-8 bg-teal-700 text-teal-50 sticky top-0 left-0 right-0">
            <div className="h-full max-w-5xl mx-auto flex items-center justify-between text-sm sm:text-base">
                <div className="flex items-center gap-4 sm:gap-8 font-light">
                    <Link href="/">
                        <a className="flex items-center justify-center text-cyan-200 underline text-base sm:text-lg drop-shadow-md font-extrabold">
                            <span className="hidden sm:block">teardrop</span>
                        </a>
                    </Link>
                    <Link href="/decrypt">
                        <a className="flex items-center justify-center text-cyan-200 text-base sm:text-lg drop-shadow-md font-semibold">
                            <span>decrypt</span>
                        </a>
                    </Link>
                    {session && (
                        <Link href="/list">
                            <a className="flex items-center justify-center text-cyan-200 text-base sm:text-lg drop-shadow-md font-semibold">
                                <span>list</span>
                            </a>
                        </Link>
                    )}
                </div>
                <div className="flex items-center gap-4 sm:gap-8">
                    { session ? (
                            <a onClick={signOut} className='cursor-pointer'>
                                <span>Sign Out</span>
                            </a>
                        ) : (
                            <a onClick={signIn} className='cursor-pointer'>
                                <span>Sign In</span>
                            </a> 
                        )
                    }
                    
                </div>
            </div>
        </nav>
    )
}