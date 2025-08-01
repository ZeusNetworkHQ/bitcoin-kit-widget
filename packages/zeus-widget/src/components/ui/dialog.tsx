"use client";

import * as React from "react";

import * as DialogPrimitive from "@radix-ui/react-dialog";

import { cn } from "@/utils/misc";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = ({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> & {
  ref?: React.RefObject<React.ComponentRef<
    typeof DialogPrimitive.Overlay
  > | null>;
}) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "zeus:fixed zeus:inset-0 zeus:z-50 zeus:bg-black/80 zeus:data-[state=open]:animate-in zeus:data-[state=closed]:animate-out zeus:data-[state=closed]:fade-out-0 zeus:data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
);
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = ({
  ref,
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  ref?: React.RefObject<React.ComponentRef<
    typeof DialogPrimitive.Content
  > | null>;
}) => (
  <DialogPrimitive.Content
    ref={ref}
    className={cn(
      "zeus:fixed zeus:left-[50%] zeus:top-[50%] zeus:z-50 zeus:grid zeus:w-full zeus:max-w-lg zeus:translate-x-[-50%] zeus:translate-y-[-50%] zeus:gap-4 zeus:border zeus:bg-background zeus:p-6 zeus:shadow-lg zeus:duration-200 data-[state=open]:zeus:animate-in data-[state=closed]:zeus:animate-out data-[state=closed]:zeus:fade-out-0 data-[state=open]:zeus:fade-in-0 data-[state=closed]:zeus:zoom-out-95 data-[state=open]:zeus:zoom-in-95 data-[state=closed]:zeus:slide-out-to-left-1/2 data-[state=closed]:zeus:slide-out-to-top-[48%] data-[state=open]:zeus:slide-in-from-left-1/2 data-[state=open]:zeus:slide-in-from-top-[48%]",
      className
    )}
    {...props}
  >
    {children}
  </DialogPrimitive.Content>
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "zeus:flex zeus:flex-col zeus:space-y-1.5 zeus:text-center sm:zeus:text-left",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "zeus:flex zeus:flex-col-reverse sm:zeus:flex-row sm:zeus:justify-end sm:zeus:space-x-2",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = ({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> & {
  ref?: React.RefObject<React.ComponentRef<
    typeof DialogPrimitive.Title
  > | null>;
}) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "zeus:text-lg zeus:font-semibold zeus:leading-none zeus:tracking-tight",
      className
    )}
    {...props}
  />
);
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = ({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> & {
  ref?: React.RefObject<React.ComponentRef<
    typeof DialogPrimitive.Description
  > | null>;
}) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("zeus:text-sm zeus:text-muted-foreground", className)}
    {...props}
  />
);
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
