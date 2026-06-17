import { Link, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Button from "./ui/Button";
import { toast } from "sonner";



export default function Header() {

    const location = useLocation();
    const { user, fetchUser } = useAuth();

    async function handleLogout() {
        try {
            const response = await fetch("http://localhost:3000/auth/logout", {
                method: "POST",
                credentials: "include"
            });
            if (!response.ok) {
                toast.error("failed to logout");
                return;
            }

            const data = await response.json();
            toast.success("user logged out successfully");
            await fetchUser();
            return;

        } catch (error) {
            toast.error(error instanceof Error ? error.message : "unknown error");
            return;
        }
    }


    return (
        <header className="h-14 border-b border-gray-400 flex items-center justify-between px-4">

            <section>
                <Link to={"/"}>
                    <h1 className="text-xl font-semibold">PayFlow</h1>
                </Link>
            </section>

            <nav>
                <ul className="flex items-center gap-x-2 text-zinc-500">

                    {
                        user ? <Button variant="danger" className="text-black" onClick={handleLogout}>Logout</Button> : (<>
                            <Link to={"/signup"}>
                                <li className="hover:text-zinc-950 hover:cursor-pointer">Signup</li>
                            </Link>

                            <Link to={"/signin"}>
                                <li className="hover:text-zinc-950 hover:cursor-pointer">Signin</li>
                            </Link>
                        </>
                        )
                    }

                </ul>
            </nav>

        </header>
    )
}