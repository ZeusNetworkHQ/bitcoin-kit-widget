"use client";
import { anticipate, motion } from "motion/react";
import { useId } from "react";

export interface IconProps {
  className?: string;
  size?: 18 | 14 | 12;
  animationTrigger?: number;
}

export const WidgetIcon = ({
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
            x="10.6666"
            y="9"
            width="5"
            height="5"
            rx="1.5"
            fill="black"
            initial={{ x: 0, y: 0 }}
            animate={
              animationTrigger > 0
                ? { x: [0, -8, -8, 0, 0], y: [0, 0, -4, -4, 0] }
                : { x: 0, y: 0 }
            }
            transition={{
              duration: 1.5,
              ease: anticipate,
            }}
          />
        </mask>
      </defs>

      <motion.path
        d="M3.91663 15.5H14.4166C15.9336 15.5 17.1666 14.267 17.1666 12.75V5.25C17.1666 3.733 15.9336 2.5 14.4166 2.5H3.91663C2.39963 2.5 1.16663 3.733 1.16663 5.25V12.75C1.16663 14.267 2.39963 15.5 3.91663 15.5Z"
        fill="currentColor"
        mask={`url(#${maskId})`}
      />
    </motion.svg>
  );
};
