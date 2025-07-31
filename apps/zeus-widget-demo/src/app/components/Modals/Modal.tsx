import Icon from "../../components/Icon/Icon";
import { cn } from "../../lib/utils";
import {
  AnimatePresence,
  motion,
  PanInfo,
  useDragControls,
  MotionProps,
} from "motion/react";
import { createContext, useContext } from "react";
import { useState } from "react";
import { useWindowSize } from "usehooks-ts";

export interface ModalProps {
  /** Modal Type */
  type?: "default" | "emphasized" | "binary";
  /** Desktop Width */
  width?: number;
  /** Is the modal open */
  isOpen: boolean;
  /** Function to call when modal is closed */
  onClose?: () => void;
  /** Is the modal a drawer on mobile */
  isResponsive?: boolean;
  /** Custom classNames of Modal*/
  className?: string;
  /** Custom clasNames of ModalCard */
  cardClassName?: string;
  /** Modal Content */
  children: React.ReactNode;
  /** Backdrop Type*/
  backdropType: "default" | "hidden" | "overrideHeader";
  /** Custom Positioning */
  /* Overrides Center Positioning */
  position?: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  } | null;
  /** Animate from */
  animateFrom?: "top" | "bottom" | null;
  /** Close on Backdrop Click */
  closeOnBackdropClick?: boolean;
}

export interface ModalHeaderProps {
  /** Title */
  title?: string;
  /** Close Button */
  onClose?: () => void;
  /** Custom ClassName */
  className?: string;
  /** Hide close button */
  hideCloseButton?: boolean;
}

export interface ModalBodyProps {
  /** Children */
  children: React.ReactNode;
  /** Custom ClassName */
  className?: string;
}

export interface ModalActionsProps {
  /** Children */
  children: React.ReactNode;
  /** Annotation */
  annotation?: string;
  /** Custom ClassName */
  className?: string;
}

interface ModalContextType {
  type?: "default" | "emphasized" | "binary";
  isResponsive?: boolean;
}

const ModalContext = createContext<ModalContextType>({
  type: "default",
  isResponsive: true,
});

const Modal = ({
  width = 360,
  isOpen = false,
  onClose,
  isResponsive = true,
  cardClassName,
  children,
  backdropType = "default",
  position = null,
  type = "default",
  animateFrom = "bottom",
  closeOnBackdropClick = true,
  className,
}: ModalProps) => {
  // Responsive Drawer Controls
  const dragControls = useDragControls();
  const [initialHeight, setInitialHeight] = useState(0);
  const { width: windowWidth } = useWindowSize();
  const isMobile = windowWidth < 640;

  const handleDragStart = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    setInitialHeight(info.point.y);
  };
  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.point.y - initialHeight > 150) {
      onClose?.();
    }
  };

  const attributes: Partial<MotionProps> =
    isMobile && isResponsive
      ? {
          onDragStart: handleDragStart,
          dragControls: dragControls,
          drag: "y",
          onDragEnd: handleDragEnd,
          dragConstraints: { top: 0, bottom: 0 },
        }
      : {};

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalContext.Provider value={{ type, isResponsive }}>
          <motion.div
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "fixed inset-0 z-40 flex h-screen w-full items-center justify-center overflow-y-auto",
              backdropType === "overrideHeader" && "!z-60",
              className
            )}
          >
            {/* Backdrop */}
            <motion.div
              key="card"
              onClick={closeOnBackdropClick ? onClose : undefined}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, ease: "easeOut", delay: 0.1 }}
              className={cn(
                "z-30 h-full w-full",
                // Default Style
                backdropType === "default" &&
                  "bg-sys-color-background-overlay absolute inset-0 backdrop-blur-sm",
                // Hidden Styles
                backdropType === "hidden" &&
                  "absolute bg-transparent backdrop-blur-none",
                // Override Header
                backdropType === "overrideHeader" &&
                  "bg-sys-color-background-overlay fixed inset-0 z-50 backdrop-blur-sm"
              )}
            ></motion.div>

            {/* Card */}
            <motion.div
              initial={
                animateFrom
                  ? { opacity: 0, y: animateFrom === "top" ? -20 : 20 }
                  : {}
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              exit={
                isResponsive
                  ? { opacity: 0, y: animateFrom === "top" ? -5 : 5 }
                  : {}
              }
              className={cn(
                // All Styles
                "gradient-border bg-sys-color-background-card rounded-16 before:from-sys-color-text-mute/30 before:to-sys-color-text-mute/10 relative z-50 items-center justify-center px-16 shadow-[0px_2px_6px_rgba(15,15,18,0.4)] before:z-10",
                // Default + Binary Styles
                (type === "default" || type === "binary") && "py-24",
                // Mobile Styles
                "max-w-[calc(100dvw-16px)]",
                // Desktop Styles
                "px-16",
                // Emphasized Padding
                type === "emphasized" && "pb-16 pt-24",
                // Drawer Mobile Styles
                isResponsive &&
                  "absolute bottom-16 min-w-[calc(100dvw-16px)] sm:!relative sm:min-w-[auto]",
                // Positioning
                position !== null && "!absolute sm:!absolute",
                cardClassName
              )}
              style={{
                width: width ? `${width}px` : "auto",
                top:
                  position?.top && !isMobile ? `${position.top}px` : undefined,
                left:
                  position?.left && !isMobile
                    ? `${position.left}px`
                    : undefined,
                right:
                  position?.right && !isMobile
                    ? `${position.right}px`
                    : undefined,
                bottom:
                  position?.bottom && !isMobile
                    ? `${position.bottom}px`
                    : undefined,
              }}
              {...attributes}
            >
              {children}
            </motion.div>
          </motion.div>
        </ModalContext.Provider>
      )}
    </AnimatePresence>
  );
};

const ModalHeader = ({
  title,
  onClose,
  className,
  hideCloseButton,
}: ModalHeaderProps) => {
  const { type, isResponsive } = useContext(ModalContext);
  return (
    <div className="z-20 flex w-full flex-col items-center justify-center">
      {isResponsive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, ease: "easeOut", delay: 0.25 }}
          className="h-apollo-6 bg-apollo-border-20 absolute top-[15px] w-[75px] rounded-full sm:hidden"
        ></motion.div>
      )}
      {/* Close Button */}
      {!hideCloseButton && (
        <div
          className={cn(
            // Default Styles
            "text-sys-color-text-mute hover:text-sys-color-text-primary absolute right-16 top-16 transition hover:cursor-pointer",
            // Hide on Mobile if Responsive
            isResponsive && "hidden sm:block",
            className
          )}
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onClose?.();
            }
          }}
        >
          <Icon name="Close" />
        </div>
      )}
      {title && (
        <div
          className={cn("flex w-full items-center justify-center", {
            // Default Styles
            "text-sys-color-text-primary headline-headline5":
              type === "default" || type === "binary",
            // Annotation Styles
            "text-sys-color-text-secondary headline-headline6 pt-4":
              type === "emphasized",
            // Drawer / Binary + Default Mobile Styles
            "!pt-32 sm:!pt-0":
              isResponsive && (type === "default" || type === "binary"),
            // Emphasized + Default Mobile Styles
            "!pt-32 sm:!pt-4": isResponsive && type === "emphasized",
          })}
        >
          {title}
        </div>
      )}
    </div>
  );
};

const ModalBody = ({ children, className }: ModalBodyProps) => {
  const { type } = useContext(ModalContext);
  return (
    <div
      className={cn(
        "text-sys-color-text-secondary paragraph-paragraph1 relative z-10 flex flex-col items-center justify-center text-center",
        // Default Styles
        type === "default" && "pb-24 pt-8 sm:pt-16",
        // Emphasized Styles
        type === "emphasized" && "pb-32 pt-8 sm:pt-16",
        // Binary Styles
        type === "binary" && "pb-24 pt-8 sm:pt-12",
        className
      )}
    >
      {children}
    </div>
  );
};

const ModalActions = ({ children, className }: ModalActionsProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center gap-y-24",
        className
      )}
    >
      <div className="relative z-10 flex w-full items-center gap-x-8">
        {children}
      </div>
    </div>
  );
};

export { Modal, ModalHeader, ModalBody, ModalActions };

export default Modal;
