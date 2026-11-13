"use client";
import { motion } from "framer-motion";
import { COPY } from "../_lib/design";
import { Letters } from "./Words";

export default function Forget() {
  return (
    <section className="forget" id="forget">
      <motion.h2
        initial={{ scale: 0.9 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 120, damping: 10 }}
      >
        <Letters text={COPY.forget} stagger={0.05} />
      </motion.h2>
    </section>
  );
}
