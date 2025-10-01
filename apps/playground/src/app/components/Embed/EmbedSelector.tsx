"use client";

import { motion } from "motion/react";
import { useState } from "react";

import { cn } from "../../lib/utils";
import ModalTab from "../Embed/ModalTab";
import WidgetTab from "../Embed/WidgetTab";
import IntegratedTab from "../Embed/IntegratedTab";
import Icon from "../Icon/Icon";

export default function EmbedSelector() {
  const [selectedTab, setSelectedTab] = useState<
    "modal" | "widget" | "integrated"
  >("modal");

  const [hoveredTab, setHoveredTab] = useState<
    "modal" | "widget" | "integrated" | null
  >(null);

  // Animation trigger counters - increment to start new animation
  const [modalAnimationTrigger, setModalAnimationTrigger] = useState(0);
  const [widgetAnimationTrigger, setWidgetAnimationTrigger] = useState(0);
  const [integratedAnimationTrigger, setIntegratedAnimationTrigger] =
    useState(0);

  const handleHover = (tab: "modal" | "widget" | "integrated") => {
    setHoveredTab(tab);
    // Increment the animation trigger for the hovered tab
    if (tab === "modal") {
      setModalAnimationTrigger((prev) => prev + 1);
    } else if (tab === "widget") {
      setWidgetAnimationTrigger((prev) => prev + 1);
    } else if (tab === "integrated") {
      setIntegratedAnimationTrigger((prev) => prev + 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col w-full max-w-[500px] gap-y-12"
    >
      <div className="w-full p-apollo-6 rounded-[24px] gap-x-4 border border-sys-color-text-mute/20 flex items-center">
        <button
          onClick={() => setSelectedTab("modal")}
          onMouseEnter={() => handleHover("modal")}
          onMouseLeave={() => setHoveredTab(null)}
          className={cn(
            "w-full relative rounded-16 body-body1-medium flex flex-col gap-y-1 sm:gap-y-0 sm:flex-row justify-center items-center gap-x-8 transition-colors sm:py-20 py-12",
            selectedTab !== "modal" && "hover:bg-sys-color-background-card/15",
            selectedTab === "modal" && "text-sys-color-text-primary",
          )}
        >
          {selectedTab === "modal" && (
            <motion.div
              layoutId="selected-tab"
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="absolute inset-0 bg-sys-color-background-card/50 rounded-16"
            ></motion.div>
          )}
          <Icon
            name="ModalIcon"
            className="relative z-1"
            animationTrigger={modalAnimationTrigger}
          />
          <span className="relative z-1">Modal</span>
        </button>
        <button
          onClick={() => setSelectedTab("widget")}
          onMouseEnter={() => handleHover("widget")}
          onMouseLeave={() => setHoveredTab(null)}
          className={cn(
            "w-full relative rounded-16 body-body1-medium flex flex-col gap-y-1 sm:gap-y-0 sm:flex-row justify-center items-center gap-x-8 transition-colors sm:py-20 py-12",
            selectedTab === "widget" && "text-sys-color-text-primary",
            selectedTab !== "widget" && "hover:bg-sys-color-background-card/15",
          )}
        >
          {selectedTab === "widget" && (
            <motion.div
              transition={{ duration: 0.2, ease: "easeInOut" }}
              layoutId="selected-tab"
              className="absolute inset-0 bg-sys-color-background-card/50 rounded-16"
            ></motion.div>
          )}
          <Icon
            name="WidgetIcon"
            className="relative z-1"
            animationTrigger={widgetAnimationTrigger}
          />
          <span className="relative z-1">Widget</span>
        </button>
        <button
          onClick={() => setSelectedTab("integrated")}
          onMouseEnter={() => handleHover("integrated")}
          onMouseLeave={() => setHoveredTab(null)}
          className={cn(
            "w-full relative rounded-16 body-body1-medium flex flex-col gap-y-1 sm:gap-y-0 sm:flex-row justify-center items-center gap-x-8 transition-colors sm:py-20 py-12",
            selectedTab === "integrated" && "text-sys-color-text-primary",
            selectedTab !== "integrated" &&
              "hover:bg-sys-color-background-card/15",
          )}
        >
          {selectedTab === "integrated" && (
            <motion.div
              transition={{ duration: 0.2, ease: "easeInOut" }}
              layoutId="selected-tab"
              className="absolute inset-0 bg-sys-color-background-card/50 rounded-16"
            ></motion.div>
          )}
          <Icon
            name="IntegratedIcon"
            className="relative z-1"
            animationTrigger={integratedAnimationTrigger}
          />
          <span className="relative z-1">Integrated</span>
        </button>
      </div>

      <div className="relative flex flex-col gap-y-32 p-8 pb-20 bg-sys-color-background-light border border-sys-color-text-mute/15 rounded-[24px]">
        {selectedTab === "modal" && (
          <>
            <ModalTab />
            <span className="text-center text-balance body-body2-medium mx-auto w-3/4">
              The modal is opened by a call to action, and covers the whole
              application.
            </span>
          </>
        )}
        {selectedTab === "widget" && (
          <>
            <WidgetTab />
            <span className="text-center text-balance body-body2-medium mx-auto w-3/4">
              The widget sits in the corner, and floats above your dApp without
              disruption.
            </span>
          </>
        )}
        {selectedTab === "integrated" && (
          <>
            <IntegratedTab />
            <span className="text-center text-balance body-body2-medium mx-auto w-3/4">
              Rendered as part of your dApp&apos;s UI, doesn&apos;t require a
              call to action.
            </span>
          </>
        )}
      </div>
    </motion.div>
  );
}
