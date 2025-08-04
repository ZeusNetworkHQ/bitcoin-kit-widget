"use client";

import { anticipate, motion } from "motion/react";
import { DialogZeusWidget } from "zeus-widget";

import BadgeButton from "../BadgeButton";

import { useWidgetConfig } from "@/providers/WidgetConfigProvider";

import "zeus-widget/assets/style.css";

export default function ModalTab() {
  const widgetConfig = useWidgetConfig();

  return (
    <div className="h-[300px] relative flex flex-col items-center justify-center">
      <div className="dashed-border"></div>
      <motion.img
        src="/graphics/widget-skeleton.svg"
        className="relative z-10 w-[200px]"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: anticipate }}
      ></motion.img>
      <div className="w-full h-full absolute inset-0 z-20 mix-blend-overlay">
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "100%" }}
          transition={{ duration: 0.25, ease: anticipate }}
          className="left-1/2 -translate-x-[108px] absolute top-0 h-full w-px bg-white"
        ></motion.div>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "100%" }}
          transition={{ duration: 0.25, ease: anticipate }}
          className="left-1/2 translate-x-[108px] absolute top-0 h-full w-px bg-white"
        ></motion.div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.25, delay: 0.25, ease: anticipate }}
          className="top-1/2 translate-y-[86px] absolute left-0 h-px w-full bg-white"
        ></motion.div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.25, delay: 0.25, ease: anticipate }}
          className="top-1/2 translate-y-[-86px] absolute left-0 h-px w-full bg-white"
        ></motion.div>
      </div>
      <div className="h-full w-full absolute inset-0 overflow-hidden">
        <div className="rounded-16 bg-sys-color-background-normal/80 backdrop-blur-xl absolute w-full h-full z-5"></div>
        <img
          src="/graphics/widget-bg.webp"
          className="absolute left-1/2 -translate-x-1/2"
        ></img>
      </div>

      <DialogZeusWidget config={widgetConfig}>
        <DialogZeusWidget.Trigger asChild>
          <BadgeButton label="Open Demo Modal" icon="ArrowTopRight" />
        </DialogZeusWidget.Trigger>

        <DialogZeusWidget.Content />
      </DialogZeusWidget>
    </div>
  );
}
