import { toast } from "sonner";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import UserCard from "../components/UserCard";
import getPageNumber from "../utils/getPageNumber";
import Button from "../components/ui/Button";
import type { IBalance, IData } from "../types";
import Input from "../components/ui/Input";
import { useNavigate } from "react-router-dom";



export default function Body() {

    const { user } = useAuth();
    const [loadingBalance, setLoadingBalance] = useState(true);
    const [userBalance, setUserBalance] = useState<IBalance | null>(null);
    const [createBalanceBtn, setCreateBalanceBtn] = useState(false);
    const [allUsers, setallUsers] = useState<IData | null>(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [pageCount, setPageCount] = useState(1);
    const navigate = useNavigate();



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

    async function getAllUsers() {
        try {

            const response = await fetch(`http://localhost:3000/user/bulk?page=${pageCount}&limit=${5}`, {
                method: "GET",
                credentials: "include"
            });

            let data: IData | null;
            try {
                data = await response.json();
            } catch (error) {
                data = null;
            }

            if (!response.ok) {
                setallUsers(null);
                if (data?.success === false) {
                    toast.error(data.msg);
                }
                return;
            }
            console.log(data);

            if (data?.success) {
                setallUsers(data);
                return;
            }

        } catch (error) {
            setallUsers(null);

            if (error instanceof TypeError) {
                toast.error(error.message);
                return;
            }

            return toast.error(error instanceof Error ? error.message : "something went wrong");
        } finally {
            setLoadingUser(false);
        }
    }


    useEffect(() => {
        fetchUserBalance();
    }, []);


    useEffect(() => {
        getAllUsers();
    }, [pageCount]);



    return (
        <div className="px-4">

            <section className="mt-8 flex justify-between items-center px-4">
                <h1 className="">Welcome <span className="font-medium bg-zinc-100 p-1 rounded-md capitalize">{`${user?.firstName} ${user?.lastName ? user?.lastName : ""}`}</span></h1>

                <h2 className="mt-1 flex items-center"><span className="text-lg font-semibold"> {loadingBalance ? "fetching userBalance..." : (!userBalance ? (createBalanceBtn ? <Button onClick={() => navigate("/createAccount")}>Create Account</Button> : "failed to get User Balance") : `Your Balance : Rs-${userBalance.account?.balance}`)} </span></h2>

            </section>

            <section className="flex items-center justify-center mt-8">
                <Input whileFocus={{ scale: 1.2 }} type="text" placeholder="search user with name" className="md:w-xl mb-3 w-md" />
            </section>

            <section className="text-center bg-zinc-100 p-5 rounded-md mt-8 max-w-3xl mx-auto mb-5">
                {
                    loadingUser ? "Fetching All Users..." : (
                        allUsers === null ? "failed to get All Users" : (
                            allUsers.allUsers.length === 0 ? "Users list is empty" : (
                                allUsers.allUsers.map(user => <div className="mb-5" key={user._id}>
                                    <UserCard accountPresent={createBalanceBtn ? false : true} data={user} />
                                </div>
                                )
                            )
                        )
                    )
                }

                {
                    allUsers !== null && allUsers?.allUsers.length !== 0 && <div className="mt-5 text-center space-x-5">
                        {
                            <Button variant="ghost" disabled={pageCount === 1 || loadingUser} onClick={() => {
                                setPageCount(current => current - 1)
                            }}>Prev</Button>
                        }

                        {
                            getPageNumber(allUsers.totalPage, allUsers.page).map((num, index) => (
                                num === allUsers.page ? <Button size="md" disabled={true}>{num}</Button> :
                                    < Button onClick={() => setPageCount(num)} disabled={loadingUser} variant="ghost" key={num} > {num}</Button>
                            ))
                        }

                        {
                            <Button variant="ghost" disabled={loadingUser || pageCount === allUsers.totalPage} onClick={() => {
                                setPageCount(current => current + 1);
                            }}>Next</Button>
                        }

                    </div>
                }
            </section >

        </div >
    )

}