import { useNavigate } from "react-router-dom"
import Button from "./ui/Button"
import useAuth from "../hooks/useAuth";
import Input from "./ui/Input";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateAccount() {

    const navigate = useNavigate();
    const { user } = useAuth();
    const [inputValue, setInputValue] = useState(0);


    function handleCreateAccBtn() {
        if (!inputValue || inputValue < 1000) {
            return toast.error("minimum 1000 rupees required to open an account");
        }


    }


    return (
        <div className="flex flex-col py-12 px-4">

            <div className="mb-12">
                <Button onClick={() => navigate("/")}>Back To Home</Button>
            </div>
            <div className="mx-auto border p-5 bg-amber-400 w-xl rounded-md">

                <h1 className="text-center text-2xl mb-5">Welcome: <span className="capitalize">{user?.firstName}</span></h1>

                <h2 className="mb-2">Create your Bank Account</h2>

                <div className="flex flex-col gap-y-3">
                    <Input value={inputValue} onChange={(e) => setInputValue(parseInt(e.target.value))} required type="number" placeholder="enter deposit amount" />

                    <Button onClick={handleCreateAccBtn} size="lg" variant="secondary">Create Account</Button>
                </div>
            </div>
        </div>
    )
}