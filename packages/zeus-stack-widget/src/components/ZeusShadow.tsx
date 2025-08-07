import React, { useContext, useEffect, useRef, useState } from "react";

import { createPortal } from "react-dom";

import css from "@/global.css?inline";

const IsApplyShadowContext = React.createContext(false);

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
  const ref = useRef<HTMLDivElement>(null);
  const [parentShadowRoot, setParentShadowRoot] = useState<ShadowRoot | null>(
    null,
  );

  const [ready, setReady] = useState(false);
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);

  const attachShadowRoot = () => {
    const host = ref.current;
    if (!host) return null;

    try {
      return host.attachShadow({ mode: "open" });
    } catch {
      console.error(
        "Failed to create shadow root, your browser may not support it.",
      );
      return null;
    }
  };

  useEffect(() => {
    if (!ready) return setReady(true);

    function findParentShadowRoot(element: Element | null): ShadowRoot | null {
      if (!element || element === globalThis.document?.body) return null;
      if (element.shadowRoot) return element.shadowRoot;
      return findParentShadowRoot(element.parentElement);
    }

    const parentShadowRoot = findParentShadowRoot(ref.current);
    setParentShadowRoot(parentShadowRoot);

    if (!parentShadowRoot) setShadowRoot(attachShadowRoot());
  }, [ready]);

  return (
    <IsApplyShadowContext.Provider value={true}>
      <div className="zeus:contents" ref={ref}>
        {parentShadowRoot && children}
        {!parentShadowRoot &&
          shadowRoot &&
          createPortal(
            <>
              <style>{css}</style>
              {children}
            </>,
            shadowRoot,
          )}
      </div>
    </IsApplyShadowContext.Provider>
  );
};

ZeusShadow.useIsApplyShadow = () => {
  return useContext(IsApplyShadowContext);
};

export default ZeusShadow;
