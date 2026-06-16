import clsx from "clsx";

interface IProps extends React.ComponentProps<"button"> {
    className?: string;
    size?: "sm" | "md" | "lg";
    variant?: "primary" | "secondary" | "tertiary" | "danger";
    children: React.ReactNode;
}

export default function Button({ children, className, disabled, size = "sm", variant = "primary", ...props }: IProps) {

    const baseStyle = "border rounded-md";

    const sizes = {
        sm: "px-1 py-1 text-sm",
        md: "px-2 py-1 text-md",
        lg: "px-3 py-1 text-lg"
    }

    const variants = {
        primary: "bg-gray-300 hover:bg-gray-400",
        secondary: "bg-zinc-300 hover:bg-blue-500 hover:text-white",
        tertiary: "bg-green-400 hover:bg-green-500 hover:text-white",
        danger: "bg-red-400 hover:bg-red-600"
    }

    return (
        <button disabled={disabled} {...props} className={clsx(className, baseStyle, sizes[size], variants[variant], disabled ? "opacity-50 pointer-events-none" : "cursor-pointer")}>
            {children}
        </button>
    )
}