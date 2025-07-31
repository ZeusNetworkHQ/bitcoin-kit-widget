import { cn } from "@/utils/misc";

export interface ZeusButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary";
}

function ZeusButton({
  className,
  variant,
  type,
  children,
  disabled,
  onClick,
  ...props
}: ZeusButtonProps) {
  const getVariantClass = () => {
    switch (variant) {
      case "secondary":
        return "zeus:secondary-bg";

      case "tertiary":
        return "zeus:tertiary-colors zeus:transition-colors";

      case "primary":
      default:
        return "zeus:gradient-bg";
    }
  };

  const getAdditionalElementClasses = () => {
    switch (variant) {
      case "secondary":
        return "zeus:border-solid zeus:border-[1px] zeus:border-[#E1E1E199]";
      case "tertiary":
        return "zeus:border-solid zeus:border-[1px] zeus:border-[#FFFFFF0D]";
      case "primary":
      default:
        return "zeus:border-solid zeus:border-[1px] zeus:border-[#FFFFFF80]";
    }
  };

  return (
    <button
      {...props}
      className={cn(
        getVariantClass(),
        "zeus:transition-shadow zeus:button zeus:body-body1-semibold zeus:relative zeus:px-[16px] zeus:py-[8px] zeus:flex zeus:flex-row zeus:items-center zeus:justify-center zeus:cursor-pointer",
        disabled && "zeus:cursor-not-allowed",
        className
      )}
      type={type || "button"}
      onClick={disabled ? undefined : onClick}
    >
      {children}
      <div
        className={cn(
          "zeus:w-full zeus:h-full zeus:absolute zeus:top-0 zeus:left-0 zeus:pointer-events-none zeus:rounded-[inherit]",
          getAdditionalElementClasses()
        )}
      />
    </button>
  );
}

export default ZeusButton;
