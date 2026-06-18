import { motion } from "motion/react";
import SignupForm from "../components/SignupForm";

export default function Signup() {
    return (
        <motion.div initial={{ y: -100 }} animate={{ y: 0 }} transition={{ ease: "easeInOut", duration: 1 }} className="py-12">
            <SignupForm />
        </motion.div>
    )
}