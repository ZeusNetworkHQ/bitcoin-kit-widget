"use client";

import Icon from "./Icon/Icon";

export default function Footer() {
  return (
    <div className="flex items-center justify-center gap-x-20 pb-24">
      <a
        href={process.env.NEXT_PUBLIC_X_LINK}
        className="transition hover:text-sys-color-text-primary"
      >
        <Icon name="X" size={16 as 18}></Icon>
      </a>
      <a
        href={process.env.NEXT_PUBLIC_DISCORD_LINK}
        className="transition hover:text-sys-color-text-primary"
      >
        <Icon name="Discord" size={16 as 18}></Icon>
      </a>
    </div>
  );
}
