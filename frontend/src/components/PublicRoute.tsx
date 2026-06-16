import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth"

export default function PublicRoute({ children }: { children: React.ReactNode }) {

    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        )
    }

    if (user) {
        return <Navigate to={"/"} />
    } else {
        return (
            <>
                {children}
            </>
        )
    }
}