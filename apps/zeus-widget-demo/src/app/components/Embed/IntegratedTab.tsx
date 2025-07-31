"use client";
import { motion } from "motion/react";

export default function IntegratedTab() {
  return (
    <div className="h-auto relative flex flex-col items-center justify-center p-16">
      <div className="dashed-border"></div>
      <motion.img
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        src="/graphics/widget-example.svg"
        alt="Widget Example"
      ></motion.img>
    </div>
  );
}
