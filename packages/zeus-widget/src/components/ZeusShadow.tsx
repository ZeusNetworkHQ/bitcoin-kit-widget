import React, { use, useCallback, useEffect, useRef, useState } from "react";

import { createPortal } from "react-dom";
import css from "src/global.css?inline";

const Context = React.createContext<() => ShadowRoot | null>(() => null);

export interface ZeusShadowProps {
  children: React.ReactNode;
}

/**
 * ZeusShadow is a component that creates a shadow DOM for Zeus Widget components.
 *
 * This provides style isolation by encapsulating styles within a shadow DOM boundary.
 * It is an alternative solution for applying styles. You can also import `zeus-widget/assets/style.css`
 * at the root component or global CSS instead of using this component if you're using Tailwind.
 *
 * Use this component when you need style isolation to prevent conflicts with host page styles.
 *
 * @param children - The React components to render within the shadow DOM
 * @returns A component that renders children within a shadow DOM with isolated styles
 */
const ZeusShadow = ({ children }: ZeusShadowProps) => {
  const getParentShadowRoot = use(Context);

  const hostRef = useRef<HTMLDivElement>(null);
  const parentShadowRoot = getParentShadowRoot();
  const [shadowRoot, setShadowRoot] = useState(() => parentShadowRoot);

  const shadowRootRef = useRef(shadowRoot);
  shadowRootRef.current = shadowRoot;

  const getShadowRoot = useCallback(() => shadowRootRef.current, []);

  useEffect(() => {
    const host = hostRef.current;
    const shadowRoot = shadowRootRef.current;
    const parentShadowRoot = getParentShadowRoot();
    if (!host || shadowRoot || parentShadowRoot) return;

    try {
      const shadow = host.attachShadow({ mode: "open" });
      setShadowRoot(shadow);
      shadowRootRef.current = shadow;
    } catch {
      console.error(
        "Failed to create shadow root, your browser may not support it."
      );
    }
  }, [getParentShadowRoot]);

  if (parentShadowRoot) return children;

  return (
    <div ref={hostRef} style={{ display: "contents" }}>
      {shadowRootRef.current && (
        <Context value={getShadowRoot}>
          {createPortal(
            <>
              <style>{css}</style>
              {children}
            </>,
            shadowRootRef.current
          )}
        </Context>
      )}
    </div>
  );
};

export default ZeusShadow;
