"use client";
import { anticipate, motion } from "motion/react";
import BadgeButton from "../BadgeButton";
import { useState } from "react";
import Icon from "../Icon/Icon";

export default function WidgetTab() {
  const [isOpened, setIsOpened] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);

  function handleHighlight() {
    setIsHighlighted(true);
    setTimeout(() => {
      setIsHighlighted(false);
    }, 1000);
  }

  return (
    <div className="h-[300px] relative flex flex-col items-center justify-center">
      <div className="w-full h-full absolute inset-0 z-20 mix-blend-overlay">
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "100%" }}
          transition={{ duration: 0.25, ease: anticipate }}
          className="right-0 -translate-x-[232px] absolute top-0 h-full w-px bg-white"
        ></motion.div>
      </div>
      <div className="flex flex-col gap-y-12 justify-center w-full rounded-2xl h-full overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full rounded-2xl right-0 -translate-x-[calc(248px)] h-[50px] flex-shrink-0 bg-sys-color-background-overlay"
        ></motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="w-full rounded-2xl right-0 h-[200px] -translate-x-[calc(248px)] flex-shrink-0 bg-sys-color-background-overlay"
        ></motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full rounded-2xl right-0 h-[200px] -translate-x-[calc(248px)] flex-shrink-0 bg-sys-color-background-overlay"
        ></motion.div>
      </div>
      <motion.button
        key={isHighlighted ? "highlight" : "normal"}
        initial={{ opacity: 0 }}
        animate={{ opacity: [1, 0.25, 1, 0.5, 1, 0.75, 1] }}
        transition={{ duration: 1, ease: anticipate }}
        onClick={() => setIsOpened(!isOpened)}
        className="backdrop-blur-xl z-100 cursor-pointer !fixed right-16 bottom-16 md:bottom-24 flex items-center justify-center md:right-24 h-[50px] w-[50px] bg-white/5 hover:bg-white/8 transition-all duration-200 hover:shadow-[inset_0px_4px_12px_rgba(139,138,158,0.2)] shadow-[inset_0px_4px_10px_rgba(139,138,158,0.15)] gradient-border before:[background:linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] rounded-[12px]"
      >
        {!isOpened && <img src="/branding/logo-glyph.svg"></img>}
        {isOpened && <Icon name="ChevronDown" size={18} />}
      </motion.button>
      <div className="dashed-border"></div>
      <div className="absolute flex flex-col gap-y-8 right-16 bottom-16 items-end">
        <motion.img
          src="/graphics/widget-skeleton.svg"
          className="w-[200px]"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: anticipate }}
        ></motion.img>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: anticipate }}
          className="bg-white/5 backdrop-blur shadow-[inset_0px_2px_6px_rgba(139,138,158,0.15)] w-[30px] h-[30px] gradient-border before:[background:linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] rounded-[6px]"
        ></motion.div>
      </div>
      <BadgeButton label="Click to highlight" onClick={handleHighlight} />
    </div>
  );
}
