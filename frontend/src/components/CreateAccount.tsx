import { useNavigate } from "react-router-dom"
import Button from "./ui/Button"
import useAuth from "../hooks/useAuth";
import Input from "./ui/Input";
import { useState } from "react";
import { toast } from "sonner";
import type { IBalance } from "../types";
import { Loader2 } from "lucide-react";



export default function CreateAccount() {

    const navigate = useNavigate();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState(0);



    async function createAccount() {
        try {
            setIsLoading(true);

            const response = await fetch("http://localhost:3000/account/create", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ amount: inputValue })
            })

            let data: IBalance | null;

            try {
                data = await response.json();
            } catch (error) {
                data = null;
            }

            if (!response.ok) {
                if (data) {
                    if (!data.success) {
                        return toast.error(data?.error || data?.msg);
                    }
                }
                return toast.error("failed to create a new account");
            }

            if (data?.success) {
                toast.success(data.msg);
                navigate("/");
                return;
            }

        } catch (error) {
            if (error instanceof TypeError) {
                return toast.error(error.message);
            }

            if (error instanceof Error) {
                return toast.error(error.message);
            }
            return toast.error("something went wrong while creating a new account");
        } finally {
            setIsLoading(false);
        }
    }


    function handleCreateAccBtn() {
        if (!inputValue || inputValue < 1000) {
            return toast.error("minimum 1000 rupees required to open an account");
        }

        createAccount();
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

                    <Button disabled={isLoading} onClick={handleCreateAccBtn} size="lg" variant="secondary">
                        {
                            isLoading ? <span className="flex items-center justify-center"><Loader2 className="animate-spin" /></span> : "Create Account"
                        }
                    </Button>
                </div>
            </div>
        </div>
    )
}