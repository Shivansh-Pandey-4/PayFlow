import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header() {

    const location = useLocation();


    return (
        <header className="h-14 border-b border-gray-400 flex items-center justify-between px-4">

            <section>
                <Link to={"/"}>
                    <h1 className="text-xl font-semibold">PayFlow</h1>
                </Link>
            </section>

            <nav>
                <ul className="flex items-center gap-x-2 text-zinc-500">

                    <Link to={"/signup"}>
                        <li className="hover:text-zinc-950 hover:cursor-pointer">Signup</li>
                    </Link>

                    <Link to={"/signin"}>
                        <li className="hover:text-zinc-950 hover:cursor-pointer">Signin</li>
                    </Link>
                </ul>
            </nav>

        </header>
    )
}