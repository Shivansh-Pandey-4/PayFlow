import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Model from "../components/ui/Modal";
import { useModel } from "../hooks/useModel";
import type { IResponse, IUser } from "../types";


interface IData {
    success: boolean;
    msg: string;
    user: IUser | null;
    account: {
        _id: string;
        userId: string;
        amount: number;
    } | null;
    error?: string;
}

interface IUserWithAccount extends IUser {
    account: {
        _id: string;
        userId: string;
        amount: number;
    } | null
}

export default function SendMoney() {

    const navigate = useNavigate();
    const params = useParams();
    const [isTransferring, setIsTransferring] = useState(false);
    const [user, setUser] = useState<IUserWithAccount | null>(null);
    const [inputAmount, setInputAmout] = useState<number>(0);
    const { showModel, setShowModel } = useModel();



    async function getUser() {
        try {
            const response = await fetch(`http://localhost:3000/user/${params.userId}`, {
                credentials: "include"
            });

            let data: IData | null;

            try {
                data = await response.json();
            } catch (error) {
                data = null;
            }

            if (!response.ok) {
                if (!data)
                    return toast.error("failed to get user");
                else {
                    toast.error(data.error || data.msg);
                    return
                }
            }

            if (data?.success) {
                if (data.user) {
                    setUser({
                        ...data.user,
                        account: data.account ? data.account : null
                    });
                }
            }

        } catch (error) {
            toast.error("failed to get user");
        }
    }

    async function transferMoney() {
        try {
            setIsTransferring(true);
            const response = await fetch("http://localhost:3000/account/transfer", {
                method: "PATCH",
                headers: {
                    "content-type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ amount: inputAmount, toUserId: params.userId })
            });

            let data: IResponse | null;

            try {
                data = await response.json();
            } catch (error) {
                data = null;
            }

            if (!response.ok) {
                if (data) {
                    if (!data.success) {
                        return toast.error(data.error || data.msg);
                    }
                }
                return toast.error("failed to transfer money");
            }

            if (data?.success) {
                toast.success(data.msg);
                setInputAmout(0);
                return;
            }

        } catch (error) {
            if (error instanceof TypeError) {
                return toast.error(error.message);
            }
            if (error instanceof Error) {
                return toast.error(error.message);
            }

            return toast.error("something went wrong cannot tranfer money");
        } finally {
            setShowModel(false);
            setIsTransferring(false);
        }
    }


    function handleTransferMoneyBtn() {
        if (!inputAmount || inputAmount <= 1) {
            return toast.error("Amount should be greater than Rs - 1");
        }

        setShowModel(true);

    }


    useEffect(() => {
        if (!params.userId) {
            navigate("/");
        }

        if (params.userId) {
            getUser();
        }

    }, [params.userId]);



    return (
        <div className=" py-12 px-4">

            {
                showModel &&
                <Model
                    title="Are you sure?"
                    subTitle={`Transferring ${inputAmount} rupees from your account`}
                    yesButton={<Button disabled={isTransferring} onClick={() => transferMoney()} size="md" variant="secondary">Yes</Button>}
                    noButton={<Button size="md" disabled={isTransferring} onClick={() => setShowModel(false)} variant="danger">No</Button>}
                />
            }

            <div className="mb-4">
                <Button size="md" onClick={() => navigate("/")} variant="tertiary">Back To Home</Button>
            </div>


            {
                !user ? <div className="bg-gray-300 p-10 rounded-md"> <h1 className="text-2xl text-center">User Not Found</h1></div>
                    : <div className="border max-w-sm mx-auto w-full p-5 rounded-md mt-10 bg-white shadow-md">

                        <h1 className="text-3xl font-semibold mb-10 text-center">Send Money</h1>

                        <h1 className="text-lg   font-medium">Sending To -  <span className=" font-semibold capitalize text-green-500 bg-gray-100 px-3 rounded-md py-1"> {user?.firstName} {user?.lastName}</span>
                        </h1>

                        <p className="mt-1 text-sm text-gray-600">Amount <span className="font-semibold italic">(in Rs)</span></p>

                        {
                            user.account ? (<form className="mt-5" >
                                <div className="flex flex-col gap-3">

                                    <Input value={inputAmount} onChange={(e) => setInputAmout(parseInt(e.target.value))} type="number" placeholder="Enter amount" />

                                    <button className="border px-3 py-1 rounded-md bg-zinc-300 hover:bg-blue-500 hover:text-white cursor-pointer text-lg" type="button" onClick={handleTransferMoneyBtn} > Transfer Money</button>
                                </div>
                            </form>) : <div>
                                <h1 className="mt-4 italic text-xl text-red-600"> Your friend does not have an account.</h1>
                                <p className="mt-4">
                                    Tell your friend <span className="font-medium capitalize bg-red-300 p-1 rounded-md">{user.firstName}</span> to create an account to able receive an amount.
                                </p>
                            </div>
                        }



                    </div>
            }


        </div>
    )
}