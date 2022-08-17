import Link from "next/link"

export default function Nav(props) {
    const { names, links } = props
    return (
        <nav className="h-16 px-8 bg-teal-700 text-teal-50 sticky top-0 left-0 right-0">
            <div className="h-full max-w-5xl mx-auto flex items-center justify-between text-sm sm:text-base">
                <div className="flex items-center gap-4 sm:gap-8 font-light">
                    <Link href="/">
                        <a className="flex items-center justify-center text-cyan-200 underline text-base sm:text-lg drop-shadow-md font-bold">
                            <span className="hidden sm:block">teardrop</span>
                        </a>
                    </Link>
                    <>
                    {
                        names.map(function (name, idx) {
                            return (
                            <Link href={links[idx]} key={idx}>
                                <a>
                                    <span>{name}</span>
                                </a>
                            </Link>
                            )
                        })
                    }
                    </>
                </div>
            </div>
        </nav>
    )
}