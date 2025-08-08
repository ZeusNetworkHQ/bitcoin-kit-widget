/* eslint-disable @eslint-react/hooks-extra/no-direct-set-state-in-use-effect */

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { createPortal } from "react-dom";
import { useIsClient } from "usehooks-ts";

import IconProvider from "./Icon/IconProvider";

import css from "@/global.css?inline";

const IsApplyShadowContext = createContext(false);

function findParentShadowRoot(element: Element | null): ShadowRoot | null {
  if (!element || element === globalThis.document?.body) return null;
  if (element.shadowRoot) return element.shadowRoot;
  return findParentShadowRoot(element.parentElement);
}

function initialErrorHandler() {
  console.error(
    "Failed to create shadow root, your browser may not support it.",
  );
}

export interface ZeusShadowProps {
  children: React.ReactNode;
  onError?: (error: Error) => void;
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
 * @param onError - Optional error handler for shadow root creation errors
 * @returns A component that renders children within a shadow DOM with isolated styles
 */
const ZeusShadow = ({ children, onError }: ZeusShadowProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [parentShadowRoot, setParentShadowRoot] = useState<ShadowRoot | null>(
    null,
  );
  const handleErrorRef = useRef(onError || initialErrorHandler);

  const isClient = useIsClient();
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);

  useEffect(() => {
    function attachShadowRoot(hostElement: HTMLElement) {
      try {
        if (!hostElement) return null;
        if (hostElement.shadowRoot) return hostElement.shadowRoot;
        return hostElement.attachShadow({ mode: "open" });
      } catch (error) {
        handleErrorRef.current(error as Error);
      }
    }

    if (!isClient || !ref.current) return;

    const parentShadowRoot = findParentShadowRoot(ref.current);
    setParentShadowRoot(parentShadowRoot);
    if (!parentShadowRoot) setShadowRoot(attachShadowRoot(ref.current) || null);
  }, [isClient]);

  return (
    <IsApplyShadowContext.Provider value={true}>
      <div ref={ref}>
        {parentShadowRoot && children}
        {!parentShadowRoot &&
          shadowRoot &&
          createPortal(
            <>
              <style>{css}</style>
              <IconProvider portal={false} />
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
