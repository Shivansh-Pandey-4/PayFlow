import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

export default function useAuth() {

    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("wrap inside AuthProvider to use useAuth");
    }

    return context;
}