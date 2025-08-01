"use client";

import * as React from "react";

import * as DialogPrimitive from "@radix-ui/react-dialog";

import { cn } from "@/utils/misc";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef(
  (
    {
      className,
      ...props
    }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>,
    ref: React.ForwardedRef<React.ComponentRef<typeof DialogPrimitive.Overlay>>
  ) => (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        "zeus:fixed zeus:inset-0 zeus:z-50 zeus:bg-black/80 zeus:data-[state=open]:animate-in zeus:data-[state=closed]:animate-out zeus:data-[state=closed]:fade-out-0 zeus:data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  )
);
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef(
  (
    {
      className,
      children,
      ...props
    }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    ref: React.ForwardedRef<React.ComponentRef<typeof DialogPrimitive.Content>>
  ) => (
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "zeus:fixed zeus:left-[50%] zeus:top-[50%] zeus:z-50 zeus:grid zeus:w-full zeus:max-w-lg zeus:translate-x-[-50%] zeus:translate-y-[-50%] zeus:gap-4 zeus:border zeus:bg-background zeus:p-6 zeus:shadow-lg zeus:duration-200 zeus:data-[state=open]:animate-in zeus:data-[state=closed]:animate-out zeus:data-[state=closed]:fade-out-0 zeus:data-[state=open]:fade-in-0 zeus:data-[state=closed]:zoom-out-95 zeus:data-[state=open]:zoom-in-95",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  )
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

const DialogTitle = React.forwardRef(
  (
    {
      className,
      ...props
    }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>,
    ref: React.ForwardedRef<React.ComponentRef<typeof DialogPrimitive.Title>>
  ) => (
    <DialogPrimitive.Title
      ref={ref}
      className={cn(
        "zeus:text-lg zeus:font-semibold zeus:leading-none zeus:tracking-tight",
        className
      )}
      {...props}
    />
  )
);
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef(
  (
    {
      className,
      ...props
    }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>,
    ref: React.ForwardedRef<
      React.ComponentRef<typeof DialogPrimitive.Description>
    >
  ) => (
    <DialogPrimitive.Description
      ref={ref}
      className={cn("zeus:text-sm zeus:text-muted-foreground", className)}
      {...props}
    />
  )
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
