import Icon from "./Icon/Icon";
import { IconName } from "./Icon/icons";

export default function BadgeButton({
  label,
  className,
  icon,
  onClick,
}: {
  label: string;
  className?: string;
  icon?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="transition hover:shadow-[0px_2px_0px_rgba(79,78,100,0.25),inset_0px_4px_16px_rgba(139,138,158,0.2)] shadow-[0px_1.5px_0px_rgba(79,78,100,0.25),inset_0px_4px_12px_rgba(139,138,158,0.15)] cursor-pointer !absolute z-50 bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 px-8 py-4 flex items-center gap-x-apollo-6 rounded-full body-body2-medium bg-sys-color-background-card gradient-border before:[background:linear-gradient(180deg,rgba(255,255,255,0.15),rgba(255,255,255,0.05))]"
    >
      <span className="bg-clip-text text-transparent [background-image:linear-gradient(85.6deg,#FFFFFF_5.26%,#ECE0FF_30.69%,#FEE0FF_48.39%,#FFEFE0_65.35%,#FFFAE0_78.62%)]">
        {label}
      </span>
      <Icon
        name={icon as IconName}
        size={12}
        className="text-sys-color-text-primary"
      />
    </button>
  );
}
