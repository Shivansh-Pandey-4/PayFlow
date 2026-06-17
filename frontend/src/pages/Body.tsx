import { toast } from "sonner";
import Input from "../components/ui/Input";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";

interface IBalance {
    success: boolean;
    msg: string;
    account?: {
        balance: number;
        userId: string;
    }
    error?: string;
}

export default function Body() {

    const { user } = useAuth();
    const [loadingBalance, setLoadingBalance] = useState(true);
    const [userBalance, setUserBalance] = useState<IBalance | null>(null);
    const [createBalanceBtn, setCreateBalanceBtn] = useState(false);


    async function fetchUserBalance() {

        try {
            const response = await fetch("http://localhost:3000/account/balance", {
                method: "GET",
                credentials: "include"
            });
            let data: IBalance | null;

            try {
                data = await response.json();
            } catch (error) {
                data = null;
            }

            if (!response.ok) {
                setUserBalance(null);
                if (data?.success === false) {
                    toast.error(data.msg);
                    if (data.account === null) {
                        setCreateBalanceBtn(true);
                    }
                    return;
                }
            }

            if (data?.success) {
                setUserBalance(data);
                console.log(data);
                return;
            }

        } catch (error) {
            if (error instanceof TypeError) {
                toast.error(error.message);
                return;
            }

            return toast.error(error instanceof Error ? error.message : "something went wrong");

        } finally {
            setLoadingBalance(false);
        }
    }


    useEffect(() => {
        fetchUserBalance();
    }, []);




    return (
        <div className="px-4">
            <section className="mt-8 flex justify-between items-center px-4">
                <h1 className="">Welcome <span className="font-medium bg-zinc-100 p-1 rounded-md">{`${user?.firstName.toLocaleUpperCase()} ${user?.lastName?.toUpperCase()}`}</span></h1>

                <h2 className="mt-1">Your Balance : <span className="text-lg font-semibold">Rs- {loadingBalance ? "fetching userBalance..." : (!userBalance ? "failed to get user Balance" : userBalance.account?.balance)} </span></h2>
            </section>
            <section className="flex items-center justify-center mt-8">
                <Input type="text" placeholder="search user with name" className="md:w-xl mb-3 w-md" />
            </section>
            <section>
                allUsers list
            </section>
        </div>
    )

}