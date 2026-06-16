import { toast } from "sonner";
import Button from "./ui/Button";
import Input from "./ui/Input";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupSchema } from "../validation/authSchema";
import { Loader2 } from "lucide-react";

interface IData {
    success: boolean;
    msg: string;
    error?: string;
}


export default function SignupForm() {

    const [isLoading, setIsLoading] = useState(false);

    const [inputValue, setInputValue] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });

    const navigate = useNavigate();


    async function handleSignup() {
        try {
            setIsLoading(true);

            const response = await fetch("http://localhost:3000/auth/signup", {
                method: "POST",
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
                toast.error(data?.error || data?.msg || "failed to signup");
                return;
            }

            if (data) {
                toast.success(data.msg);
                setInputValue({ email: "", password: "", firstName: "", lastName: "" })
                navigate("/signin");
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
        const result = signupSchema.safeParse(inputValue);
        if (!result.success) {
            let msg = result.error.issues[0].message;
            let path = result.error.issues[0].path.toString();
            toast.error(`err: ${msg}, path: ${path}`);
            return;
        }

        handleSignup();
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setInputValue(prev => ({ ...prev, [e.target.name]: e.target.value }));
        return;
    }


    return (

        <div className="border max-w-xs md:max-w-md mx-auto p-3 rounded-md">
            <form onSubmit={handleSubmit} >
                <div className="flex flex-col gap-y-3">
                    <h1 className="text-center text-2xl font-semibold mb-3">Signup Form</h1>

                    <div className="grid gap-y-3 md:grid-cols-2 md:gap-4">

                        <div className="flex flex-col gap-y-1">
                            <label htmlFor="firstName">FirstName</label>
                            <Input type="text" id="firstName" name="firstName" placeholder="Enter FirstName" required autoFocus value={inputValue.firstName} onChange={handleInputChange} />
                        </div>
                        <div className="flex flex-col gap-y-1">
                            <label htmlFor="lastName">LastName <span className="text-gray-600 text-sm">(Optional)</span></label>

                            <Input type="text" id="lastName" name="lastName" placeholder="Enter LastName" className="w-full" value={inputValue.lastName} onChange={handleInputChange} />
                        </div>

                    </div>

                    <div className="flex flex-col gap-y-1">
                        <label htmlFor="email">Email</label>

                        <Input required type="text" id="email" name="email" placeholder="Enter Email" className="w-full" value={inputValue.email} onChange={handleInputChange} />
                    </div>
                    <div className="flex flex-col gap-y-1">
                        <label htmlFor="password">Password</label>

                        <Input required type="password" id="password" name="password" placeholder="Enter Password" className="w-full" value={inputValue.password} onChange={handleInputChange} />
                    </div>

                    <Button disabled={isLoading} className="mt-2" size="lg" variant="secondary">
                        {
                            isLoading ? <span className="flex items-center justify-center "><Loader2 className="animate-spin" /></span> : "Signup"
                        }
                    </Button>

                    <div className="mt-1 border-t border-gray-500 text-center">
                        <h1 className="mt-2">Already have an account ? <Link className="hover:text-blue-400 font-semibold underline" to={"/signin"}>Signin</Link></h1>
                    </div>
                </div>
            </form>
        </div>
    )
}