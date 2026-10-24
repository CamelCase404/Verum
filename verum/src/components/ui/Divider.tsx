import { motion } from "framer-motion";

export function Divider() {
  return (
    <div className="w-full max-w-[1180px] mx-auto px-8 md:px-12 py-8 flex justify-center">
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.4, ease: [0.16, 0.84, 0.44, 1] }}
        className="h-px w-full bg-gradient-to-r from-transparent via-line-2 to-transparent origin-center"
      />
    </div>
  );
}
