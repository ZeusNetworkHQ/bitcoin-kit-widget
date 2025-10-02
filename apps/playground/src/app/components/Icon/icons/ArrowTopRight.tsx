export interface IconProps {
  className?: string;
  size?: 18 | 14 | 12;
  animationTrigger?: number;
}

export const ArrowTopRight = ({
  size = 12,
  animationTrigger,
  ...props
}: IconProps) => {
  return (
    <svg
      {...props}
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.74999 11C1.55799 11 1.36599 10.927 1.21999 10.78C0.926994 10.487 0.926994 10.012 1.21999 9.71902L9.54299 1.39602C9.83599 1.10302 10.311 1.10302 10.604 1.39602C10.897 1.68902 10.897 2.16402 10.604 2.45702L2.27999 10.78C2.13399 10.926 1.94199 11 1.74999 11Z"
        fill="currentColor"
      />
      <path
        d="M10.25 7.25C9.836 7.25 9.5 6.914 9.5 6.5V2.5H5.5C5.086 2.5 4.75 2.164 4.75 1.75C4.75 1.336 5.086 1 5.5 1H10.25C10.664 1 11 1.336 11 1.75V6.5C11 6.914 10.664 7.25 10.25 7.25Z"
        fill="currentColor"
      />
    </svg>
  );
};
