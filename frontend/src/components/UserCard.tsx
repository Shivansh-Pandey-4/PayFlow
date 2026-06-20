import { useNavigate } from "react-router-dom";
import type { IUser } from "../types";
import Button from "./ui/Button";


interface IProps {
    data: IUser;
    accountPresent: boolean;
}


export default function UserCard(props: IProps) {

    const { email, firstName, lastName, _id } = props.data;
    const { accountPresent } = props;
    console.log(accountPresent)

    const navigate = useNavigate();

    return (
        <div className="border max-w-2xl p-3 flex justify-between items-center mx-auto rounded-sm">
            <section className="col-span-4">
                <div className="flex items-center gap-x-2">
                    <div className="w-7 h-7 rounded-full bg-violet-500 flex items-center justify-center capitalize">{firstName[0]}</div>
                    <h1 className="capitalize font-mono">{firstName} {lastName}</h1>
                </div>
                <p className=" text-sm text-gray-600">{email}</p>
            </section>
            <section className="col-span-1 ">
                <Button disabled={!accountPresent} onClick={(e) => navigate(`/sendMoney/${_id}`)} size="md" variant="ghost">Send Money</Button>
            </section>
        </div>
    )
}