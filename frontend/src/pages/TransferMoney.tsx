import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Model from "../components/ui/Modal";
import { useModel } from "../hooks/useModel";
import type { IUser } from "../types";


interface IData {
    success: boolean;
    msg: string;
    user: IUser | null;
}


export default function SendMoney() {

    const navigate = useNavigate();
    const params = useParams();
    const [user, setUser] = useState<IUser | null>(null);
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
                    toast.error(data.msg);
                    return
                }
            }

            if (data?.success) {
                console.log(data);
                if (data.user)
                    setUser(data?.user);
            }

        } catch (error) {
            toast.error("failed to get user");
        }
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
                <Model title="Are you sure?" subTitle={`Transferring ${inputAmount} rupees from your account`} yesButton={<Button variant="secondary">Yes</Button>} noButton={<Button onClick={() => setShowModel(false)} variant="danger">No</Button>} />
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

                        <form className="mt-5" >
                            <div className="flex flex-col gap-3">

                                <Input value={inputAmount} onChange={(e) => setInputAmout(parseInt(e.target.value))} type="number" placeholder="Enter amount" />

                                <Button size="md" type="button" onClick={() => setShowModel(true)} variant="secondary"> Transfer Money</Button>
                            </div>
                        </form>

                    </div>
            }


        </div>
    )
}