/* eslint-disable @eslint-react/hooks-extra/no-direct-set-state-in-use-effect */

import { useEffect, useState } from "react";

import { createPortal } from "react-dom";
import { useIsClient } from "usehooks-ts";

import { Variant } from "./Icon";

/**
 * A hidden provider that ensures all icon SVG definitions are available in the DOM.
 * This component renders all icon variants invisibly to prevent SVG rendering issues
 * where icons with <defs> and <use> elements might appear as black squares if their
 * definitions aren't loaded as the first reference.
 *
 * By pre-rendering all icons in a hidden container, we guarantee that SVG definitions
 * are available throughout the application lifecycle.
 */

function IconProvider({ portal = true } = {}) {
  const isClient = useIsClient();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isClient || !portal) return;

    const existingContainer = globalThis.document?.getElementById(
      "zeus-icons-provider",
    ) as HTMLDivElement | undefined;
    if (existingContainer) {
      setContainer(existingContainer);
      return;
    }

    const div = document.createElement("div");
    div.id = "zeus-icons-provider";
    div.style.height = "0";
    div.style.width = "0";
    div.style.overflow = "clip";
    div.style.position = "fixed";
    document.body.prepend(div);
    setContainer(div);
  }, [isClient, portal]);

  const iconsElement = (
    <>
      {Object.entries(Variant).map(([key, Icon]) => (
        <Icon key={key} />
      ))}
    </>
  );

  if (!portal)
    return (
      <div style={{ height: 0, width: 0, overflow: "clip", position: "fixed" }}>
        {iconsElement}
      </div>
    );
  if (!isClient || !container) return null;
  return createPortal(iconsElement, container);
}

export default IconProvider;
