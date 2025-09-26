"use client";

import React, { type ForwardedRef } from "react";

import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/utils/misc";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverAnchor = PopoverPrimitive.Anchor;

const PopoverContent = React.forwardRef(
  (
    {
      className,
      align = "center",
      sideOffset = 4,
      children,
      ...props
    }: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>,
    ref: ForwardedRef<React.ElementRef<typeof PopoverPrimitive.Content>>,
  ) => (
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "zeus:relative zeus:z-50 zeus:origin-[--radix-popover-content-transform-origin] zeus:outline-none zeus:before:z-10 zeus:data-[state=open]:animate-in zeus:data-[state=closed]:animate-out zeus:data-[state=closed]:fade-out-0 zeus:data-[state=open]:fade-in-0 zeus:data-[state=closed]:zoom-out-95 zeus:data-[state=open]:zoom-in-95 zeus:data-[side=bottom]:slide-in-from-top-2 zeus:data-[side=left]:slide-in-from-right-2 zeus:data-[side=right]:slide-in-from-left-2 zeus:data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    >
      {children}
    </PopoverPrimitive.Content>
  ),
);
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
