export interface IconProps {
  className?: string;
  size?: 18 | 14 | 12;
}
export const UnisatIcon = ({ className, size = 18 }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 18 18"
      className={className}
      fill="none"
    >
      <g clipPath="url(#Unisat_svg__a)">
        <path
          fill="url(#Unisat_svg__b)"
          d="m11.858 1.62 3.694 3.657q.47.465.463.943-.008.474-.405.868-.414.411-.894.42-.479.006-.951-.46L9.987 3.306q-.644-.638-1.242-.902a1.83 1.83 0 0 0-1.257-.084q-.66.18-1.416.932-1.047 1.035-.996 1.945.052.909 1.037 1.885l3.809 3.772q.477.473.468.941-.007.47-.41.868t-.886.416q-.483.015-.96-.456l-3.69-3.658q-.9-.893-1.302-1.688-.401-.796-.298-1.802.094-.86.552-1.67.46-.807 1.313-1.654Q5.725 1.143 6.651.608 7.576.07 8.44.008a3.33 3.33 0 0 1 1.707.344q.84.405 1.713 1.267z"
        />
        <path
          fill="url(#Unisat_svg__c)"
          d="M6.064 16.38 2.37 12.724q-.47-.465-.463-.943.008-.475.405-.868.414-.411.894-.42.479-.008.952.46l3.777 3.741q.644.639 1.242.903.6.263 1.257.084.66-.18 1.417-.932 1.046-1.035.995-1.945t-1.037-1.885L9.78 8.925q-.477-.472-.468-.94.007-.47.41-.868.402-.4.886-.416.482-.017.96.456l1.912 1.877q.9.895 1.302 1.69.401.795.298 1.801a4.3 4.3 0 0 1-.552 1.669q-.46.809-1.313 1.655-1.016 1.008-1.942 1.543-.925.537-1.789.6a3.33 3.33 0 0 1-1.707-.344q-.842-.405-1.713-1.267"
        />
        <path
          fill="url(#Unisat_svg__d)"
          d="M8.369 6.942a1.357 1.357 0 1 0 0-2.713 1.357 1.357 0 0 0 0 2.713"
        />
      </g>
      <defs>
        <linearGradient
          id="Unisat_svg__b"
          x1={14.946}
          x2={3.499}
          y1={3.736}
          y2={8.822}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#070100" />
          <stop offset={0.36} stopColor="#77390D" />
          <stop offset={0.67} stopColor="#EA8101" />
          <stop offset={1} stopColor="#F4B852" />
        </linearGradient>
        <linearGradient
          id="Unisat_svg__c"
          x1={3.294}
          x2={16.558}
          y1={14.385}
          y2={10.435}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#070100" />
          <stop offset={0.37} stopColor="#77390D" />
          <stop offset={0.67} stopColor="#EA8101" />
          <stop offset={1} stopColor="#F4FB52" />
        </linearGradient>
        <radialGradient
          id="Unisat_svg__d"
          cx={0}
          cy={0}
          r={1}
          gradientTransform="translate(8.367 5.587)scale(1.35664)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F4B852" />
          <stop offset={0.33} stopColor="#EA8101" />
          <stop offset={0.64} stopColor="#77390D" />
          <stop offset={1} stopColor="#070100" />
        </radialGradient>
        <clipPath id="Unisat_svg__a">
          <path fill="#fff" d="M1.8 0h14.4v18H1.8z" />
        </clipPath>
      </defs>
    </svg>
  );
};
