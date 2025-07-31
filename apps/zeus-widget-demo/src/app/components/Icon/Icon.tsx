import { IconComponents, type IconName } from "./icons";

export interface IconProps {
  /** Name of Icon */
  name: IconName;
  /** Size of Icon */
  size?: 18 | 14 | 12;
  /** Custom Classnames / Icon Color */
  className?: string;
  /** Animation trigger - increment to start new animation */
  animationTrigger?: number;
}

const Icon = ({ className, name, size, animationTrigger }: IconProps) => {
  if (!name) return null;
  const IconComponent = IconComponents[name];

  if (!IconComponent) {
    console.warn(`Icon ${name} not found`);
    return null;
  }

  return (
    <IconComponent
      size={size}
      className={className}
      animationTrigger={animationTrigger}
    />
  );
};

export default Icon;
