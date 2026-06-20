import { X } from "lucide-react";
import Button from "./Button";
import { useModel } from "../../hooks/useModel";

interface IProps {
    title?: string;
    subTitle?: string;
    yesButton?: React.ReactNode;
    noButton?: React.ReactNode;
}

export default function Model(props: IProps) {

    const { title, yesButton, noButton, subTitle } = props;
    const { setShowModel } = useModel();

    return (

        <div className="fixed inset-0 opacity-80 backdrop-blur-2xl min-h-screen flex items-center justify-center">

            <div className="max-w-md w-full border p-5 bg-white flex flex-col items-center">
                <Button onClick={() => setShowModel(false)} className="self-end"> <X /></Button>

                <h1 className="text-xl font-semibold">{title}</h1>
                <h2 className="font-mono mt-2">{subTitle}</h2>

                <div className="space-x-4 mt-5">
                    {yesButton} {noButton}
                </div>

            </div>
        </div>
    )
}