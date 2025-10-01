export interface IconProps {
  className?: string;
  size?: 18 | 14 | 12;
  animationTrigger?: number;
}

export const XIcon = ({ className, size = 18 }: IconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.6009 2H16.0543L10.6943 8.12618L17 16.4625H12.0619L8.19493 11.4066L3.77014 16.4625H1.31521L7.04833 9.90987L1 2H6.06183L9.55732 6.62129L13.6009 2ZM12.7398 14.994H14.0993L5.32394 3.3914H3.86504L12.7398 14.994Z"
        fill="currentColor"
      />
    </svg>
  );
};
