import SigninForm from "../components/SigninForm";
import { motion } from "motion/react"

export default function Signin() {

    return (
        <motion.div initial={{ y: -100 }} animate={{ y: 0 }} transition={{ ease: "easeInOut", duration: 1 }} className="py-20">
            <SigninForm />
        </motion.div>
    )
}