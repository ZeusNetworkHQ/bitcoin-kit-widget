export interface IconProps {
  className?: string;
  size?: 18 | 14 | 12;
  animationTrigger?: number;
}

export const ChevronDown = ({
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
        d="M8.99999 13.5C8.80799 13.5 8.61599 13.427 8.46999 13.28L2.21999 7.03002C1.92699 6.73702 1.92699 6.26202 2.21999 5.96902C2.51299 5.67602 2.98799 5.67602 3.28099 5.96902L9.00099 11.689L14.721 5.96902C15.014 5.67602 15.489 5.67602 15.782 5.96902C16.075 6.26202 16.075 6.73702 15.782 7.03002L9.53199 13.28C9.38599 13.426 9.19399 13.5 9.00199 13.5H8.99999Z"
        fill="currentColor"
      />
    </svg>
  );
};
