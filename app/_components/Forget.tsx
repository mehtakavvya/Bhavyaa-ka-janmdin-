"use client";
import { motion } from "framer-motion";
import { COPY } from "../_lib/design";
import { Typewriter } from "./Words";

export default function Forget() {
  return (
    <section className="forget" id="forget">
      <motion.h2
        initial={{ scale: 0.9 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 120, damping: 10 }}
      >
        <Typewriter text={COPY.forget} step={0.07} whenInView />
      </motion.h2>
    </section>
  );
}
