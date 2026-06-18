import type { IUser } from "../pages/Body"
import Button from "./ui/Button";

interface IProps {
    data: IUser
}


export default function UserCard(props: IProps) {

    const { email, firstName, lastName } = props.data;

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
                <Button variant="ghost">Send Money</Button>
            </section>
        </div>
    )
}