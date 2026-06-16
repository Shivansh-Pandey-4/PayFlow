import clsx from "clsx"

interface IInput extends React.ComponentProps<"input"> {
    className?: string;
}


export default function Input({ className, ...props }: IInput) {

    const baseStyle = "rounded-sm border border-gray-400 px-4 py-1 focus:border-transparent focus:outline-blue-600";

    return (
        <input {...props} className={clsx(className, baseStyle)} />
    )
}