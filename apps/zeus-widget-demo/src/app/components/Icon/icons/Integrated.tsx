"use client";
import { anticipate, motion } from "motion/react";
import { useId } from "react";

export interface IconProps {
  className?: string;
  size?: 18 | 14 | 12;
  animationTrigger?: number;
}

export const IntegratedIcon = ({
  className,
  size = 18,
  animationTrigger = 0,
}: IconProps) => {
  const maskId = useId();

  return (
    <motion.svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <mask id={maskId}>
          <rect width="18" height="18" fill="white" />
          <motion.rect
            key={animationTrigger}
            x="11"
            width="4.5"
            rx="1.5"
            fill="black"
            height="10"
            initial={{
              width: 4.5,
              x: 0,
              y: 4,
              height: 10,
            }}
            animate={
              animationTrigger > 0
                ? {
                    width: [4.5, 12, 4.5],
                    x: [0, -8, 0],
                    y: [4, 10, 4],
                    height: [10, 4, 10],
                  }
                : {
                    width: 4.5,
                    x: 0,
                    y: 4,
                    height: 10,
                  }
            }
            transition={{
              duration: 1.5,
              ease: anticipate,
            }}
          />
        </mask>
      </defs>

      <motion.path
        d="M14.25 2.5H3.75C2.233 2.5 1 3.733 1 5.25V12.75C1 14.267 2.233 15.5 3.75 15.5H14.25C15.767 15.5 17 14.267 17 12.75V5.25C17 3.733 15.767 2.5 14.25 2.5Z"
        fill="currentColor"
        mask={`url(#${maskId})`}
      />
    </motion.svg>
  );
};
