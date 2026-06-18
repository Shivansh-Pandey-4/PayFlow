import clsx from "clsx"
import { motion, type HTMLMotionProps } from "motion/react";

interface IInput extends HTMLMotionProps<"input"> {
    className?: string;
}


export default function Input({ className, ...props }: IInput) {

    const baseStyle = "rounded-sm border border-gray-400 px-4 py-1 focus:border-transparent focus:outline-blue-600";

    return (
        <motion.input {...props} className={clsx(className, baseStyle)} />
    )
}