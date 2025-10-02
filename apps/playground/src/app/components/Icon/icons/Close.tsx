export interface IconProps {
  className?: string;
  size?: 18 | 14 | 12;
  animationTrigger?: number;
}

export const CloseIcon = ({
  size = 18,
  animationTrigger,
  ...props
}: IconProps) => {
  return (
    <svg
      width={size}
      height={size}
      {...props}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.99999 14.75C3.80799 14.75 3.61599 14.677 3.46999 14.53C3.17699 14.237 3.17699 13.762 3.46999 13.469L13.47 3.46999C13.763 3.17699 14.238 3.17699 14.531 3.46999C14.824 3.76299 14.824 4.23799 14.531 4.53099L4.52999 14.53C4.38399 14.676 4.19199 14.75 3.99999 14.75Z"
        fill="currentColor"
      />
      <path
        d="M14 14.75C13.808 14.75 13.616 14.677 13.47 14.53L3.46999 4.53002C3.17699 4.23702 3.17699 3.76202 3.46999 3.46902C3.76299 3.17602 4.23799 3.17602 4.53099 3.46902L14.53 13.47C14.823 13.763 14.823 14.238 14.53 14.531C14.384 14.677 14.192 14.751 14 14.751V14.75Z"
        fill="currentColor"
      />
    </svg>
  );
};
