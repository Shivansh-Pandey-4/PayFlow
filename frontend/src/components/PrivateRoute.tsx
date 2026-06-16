import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
    const { isLoading, user } = useAuth();

    if (isLoading) {
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        )
    }

    if (!user) {
        return (
            <Navigate to={"/signin"} />
        )
    }

    return (
        <>
            {children}
        </>
    )
}