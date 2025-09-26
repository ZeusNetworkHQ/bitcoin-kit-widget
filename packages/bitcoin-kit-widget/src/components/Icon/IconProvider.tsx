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
 *
 * @param portal - If true, the icons will be prepended to the body in a dedicated container. Defaults to `true`.
 */

function IconProvider({ portal = true } = {}) {
  const isClient = useIsClient();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isClient || !portal || !globalThis.document) return;

    const existingContainer = document.getElementById("zeus-icons-provider");
    if (existingContainer) {
      return setContainer(existingContainer as HTMLDivElement);
    }

    const div = document.createElement("div");
    div.id = "zeus-icons-provider";
    document.body.prepend(div); // Ensure that the container is adding at the top
    setContainer(div);
  }, [isClient, portal]);

  const iconsElement = (
    <div style={{ height: 0, width: 0, overflow: "clip", position: "fixed" }}>
      {Object.entries(Variant).map(([key, Icon]) => (
        <Icon key={key} />
      ))}
    </div>
  );

  if (!portal) return iconsElement;

  return container && createPortal(iconsElement, container);
}

export default IconProvider;
