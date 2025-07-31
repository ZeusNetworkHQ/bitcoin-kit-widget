"use client";

import React from "react";
import { cn } from "@/app/lib/utils";

export default function Button({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <button
      className={cn(
        "px-16 py-8 rounded-12 gradient-border font-medium text-sm",
        "before:[background:linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] text-shade-primary bg-white/5 shadow-[inset_0px_4px_12px_rgba(139,138,158,0.15)] hover:bg-white/8 hover:shadow-[inset_0px_4px_18px_rgba(139,138,158,0.15)] duration-500",
        className
      )}
    >
      {label}
    </button>
  );
}
