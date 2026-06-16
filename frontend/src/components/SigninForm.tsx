import { toast } from "sonner";
import Button from "./ui/Button";
import Input from "./ui/Input";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signinSchema, signupSchema } from "../validation/authSchema";
import { Loader2 } from "lucide-react";
import useAuth from "../hooks/useAuth";

interface IData {
    success: boolean;
    msg: string;
    error?: string;
}


export default function SigninForm() {

    const [isLoading, setIsLoading] = useState(false);
    const { fetchUser } = useAuth();

    const [inputValue, setInputValue] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();


    async function handleSignin() {
        try {
            setIsLoading(true);

            const response = await fetch("http://localhost:3000/auth/signin", {
                method: "POST",
                credentials: "include",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(inputValue)
            })

            let data: IData | null;

            try {
                data = await response.json();
            } catch (error) {
                data = null;
            }

            if (!response.ok) {
                toast.error(data?.error || data?.msg || "failed to signin");
                return;
            }

            if (data) {
                await fetchUser();
                toast.success(data.msg);
                setInputValue({ email: "", password: "" });
                navigate("/");
                return;
            }

        } catch (error) {

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


    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        const result = signinSchema.safeParse(inputValue);
        if (!result.success) {
            let msg = result.error.issues[0].message;
            let path = result.error.issues[0].path.toString();
            toast.error(`err: ${msg}, path: ${path}`);
            return;
        }

        handleSignin();
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setInputValue(prev => ({ ...prev, [e.target.name]: e.target.value }));
        return;
    }


    return (

        <div className="border max-w-xs md:max-w-sm mx-auto p-3 rounded-md">
            <form onSubmit={handleSubmit} >

                <div className="flex flex-col gap-y-3">
                    <h1 className="text-center text-2xl font-semibold mb-3">Signin Form</h1>

                    <div className="flex flex-col gap-y-1">
                        <label htmlFor="email">Email</label>

                        <Input required autoFocus type="text" id="email" name="email" placeholder="Enter Email" className="w-full" value={inputValue.email} onChange={handleInputChange} />
                    </div>
                    <div className="flex flex-col gap-y-1">
                        <label htmlFor="password">Password</label>

                        <Input required type="password" id="password" name="password" placeholder="Enter Password" className="w-full" value={inputValue.password} onChange={handleInputChange} />
                    </div>

                    <Button disabled={isLoading} className="mt-2" size="lg" variant="secondary">
                        {
                            isLoading ? <span className="flex items-center justify-center "><Loader2 className="animate-spin" /></span> : "Signin"
                        }
                    </Button>

                    <div className="mt-1 border-t border-gray-500 text-center">
                        <h1 className="mt-1">Don't have an account? <Link className="hover:text-blue-400 font-semibold underline" to={"/signup"}>Signup</Link></h1>
                    </div>
                </div>
            </form>
        </div>
    )
}