"use client";
import { anticipate, motion } from "motion/react";
import { useId } from "react";

export interface IconProps {
  className?: string;
  size?: 18 | 14 | 12;
  animationTrigger?: number;
}

export const ModalIcon = ({
  className,
  size = 18,
  animationTrigger = 0,
}: IconProps) => {
  const maskId = useId();

  return (
    <motion.svg
      width="19"
      height="18"
      viewBox="0 0 19 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <mask id={maskId}>
          <rect width="19" height="18" fill="white" />
          <motion.rect
            key={animationTrigger}
            x="7.33331"
            y="6.5"
            width="5"
            height="5"
            rx="1.5"
            fill="black"
            initial={{ scale: 1.2 }}
            animate={
              animationTrigger > 0
                ? { scale: [1.2, 1.2, 0, 1.2, 1.2] }
                : { scale: 1.2 }
            }
            transition={{
              duration: 1.5,
              ease: anticipate,
            }}
            style={{
              transformOrigin: "center",
            }}
          />
        </mask>
      </defs>

      <motion.path
        d="M15.0833 2.5H4.58331C3.06631 2.5 1.83331 3.733 1.83331 5.25V12.75C1.83331 14.267 3.06631 15.5 4.58331 15.5H15.0833C16.6003 15.5 17.8333 14.267 17.8333 12.75V5.25C17.8333 3.733 16.6003 2.5 15.0833 2.5Z"
        fill="currentColor"
        mask={`url(#${maskId})`}
      />
    </motion.svg>
  );
};
