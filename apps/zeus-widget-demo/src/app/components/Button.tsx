"use client";
import React from "react";
import { cn } from "@/app/lib/utils";
import { IconName } from "./Icon/icons";
import Icon from "./Icon/Icon";
import Loading from "./Icon/icons/Loading";

export default function Button({
  label,
  className,
  icon,
  onClick,
  theme,
  size = "sm",
  isLoading = false,
  disabled = false,
}: {
  label: string;
  className?: string;
  icon?: IconName;
  onClick?: () => void;
  theme: "primary" | "glass";
  size?: "sm" | "md";
  isLoading?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        "transition duration-300 hover:cursor-pointer justify-center px-16 py-apollo-10 flex items-center gap-x-8 rounded-12 gradient-border font-medium",
        theme === "glass" &&
          "before:[background:linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] text-shade-primary bg-white/5 shadow-[inset_0px_4px_12px_rgba(139,138,158,0.15)] hover:bg-white/8 hover:shadow-[inset_0px_4px_18px_rgba(139,138,158,0.15)]",
        theme === "primary" &&
          "before:[background:linear-gradient(180deg,rgba(255,255,255,0.5),rgba(255,255,255,0.3))] [background:linear-gradient(314.6deg,#FFF4AB_2.43%,#FFEBD4_24.82%,#FFD4FD_59.61%,#CEABFF_97.04%)] text-sys-color-background-normal [box-shadow:inset_0px_4px_4px_rgba(255,255,255,0.25),inset_0px_4px_12px_rgba(255,255,255,0.5)] enabled:hover:[box-shadow:inset_0px_4px_4px_rgba(255,255,255,0.25),inset_0px_4px_16px_rgba(255,255,255,1)]",
        size === "sm" && "text-sm leading-[20px]",
        size === "md" && "text-base leading-[24px]",
        className
      )}
    >
      {isLoading && <Loading />}
      {!isLoading && (
        <>
          {icon && <Icon name={icon as IconName} size={16 as 18} />}
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
