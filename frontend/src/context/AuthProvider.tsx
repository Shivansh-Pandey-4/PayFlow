import { createContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface IUser {
    _id: string;
    firstName: string;
    lastName?: string;
    email: string;
}

interface IAuthContext {
    user: IUser | null;
    setUser: React.Dispatch<React.SetStateAction<null | IUser>>;
    isLoading: boolean;
    fetchUser: () => Promise<void>
}

interface IData {
    success: boolean;
    msg: string;
    user?: IUser;
    error?: string;
}

export const AuthContext = createContext<IAuthContext | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    async function fetchUser() {
        try {
            const response = await fetch("http://localhost:3000/user/me", {
                method: "GET",
                credentials: "include"
            });

            if (!response.ok) {
                setUser(null);
                return;
            }

            const data: IData = await response.json();
            if (data.success === true) {
                if (data.user) {
                    setUser(data.user);
                    return;
                } else {
                    setUser(null);
                }
            }

        } catch (error) {
            setUser(null);
            setIsLoading(false);
            if (error instanceof TypeError) {
                toast.error(error.message);
                return;
            }
            if (error instanceof Error) {
                toast.error(error.message);
                return;
            }

        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);


    return (
        <AuthContext value={{ user, setUser, isLoading, fetchUser }}>
            {children}
        </AuthContext>
    )
}
