import { createContext, useContext, useEffect, useRef, useState } from "react";

import { createPortal } from "react-dom";
import { useIsClient } from "usehooks-ts";

import ZeusShadow from "@/components/ZeusShadow";

const PortalContainerContext = createContext<HTMLDivElement | null>(null);

export default function PortalHub({ children }: React.PropsWithChildren) {
  const ref = useRef<HTMLDivElement>(null);
  const isClient = useIsClient();

  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const parentContainer = useContext(PortalContainerContext);

  useEffect(() => {
    if (!isClient) return;
    // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
    setContainer(ref.current);
  }, [isClient]);

  if (!isClient) return null;
  if (parentContainer) return children;

  return (
    <PortalContainerContext.Provider value={container}>
      {children}
      {createPortal(
        <div ref={ref} id="zeus-portal-hub" />,
        globalThis.document?.body,
      )}
    </PortalContainerContext.Provider>
  );
}

function Portal({ children }: React.PropsWithChildren) {
  const container = useContext(PortalContainerContext);
  if (!container) return null;
  return createPortal(children, container);
}

PortalHub.Portal = function PortalHubPortal({
  children,
}: React.PropsWithChildren) {
  const isApplyShadow = ZeusShadow.useIsApplyShadow();

  return (
    <PortalHub>
      <Portal>
        {isApplyShadow ? <ZeusShadow>{children}</ZeusShadow> : children}
      </Portal>
    </PortalHub>
  );
};
