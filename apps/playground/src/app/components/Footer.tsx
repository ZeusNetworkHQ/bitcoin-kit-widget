"use client";

import Icon from "./Icon/Icon";

export default function Footer() {
  return (
    <div className="flex items-center justify-center gap-x-32 pb-24">
      <a
        href={process.env.NEXT_PUBLIC_ZEUS_STACK_HOME_LINK}
        className="transition hover:text-sys-color-text-primary font-medium text-sm"
      >
        Home
      </a>
      <a
        href={process.env.NEXT_PUBLIC_BLOG_LINK}
        className="transition hover:text-sys-color-text-primary font-medium text-sm"
      >
        Blog
      </a>
      <a
        href={process.env.NEXT_PUBLIC_DOCS_LINK}
        className="transition hover:text-sys-color-text-primary font-medium text-sm"
      >
        Docs
      </a>
    </div>
  );
}
