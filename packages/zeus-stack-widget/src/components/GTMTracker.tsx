import { useEffect } from "react";

import { useDebounceCallback, useIsClient } from "usehooks-ts";

import { GtmEventType, initializeGTM, pushGTMEvent } from "@/utils/gtm";

function findGtmEventTarget(element: EventTarget, type: string) {
  const target = (element as HTMLElement)?.closest(
    `[data-gtm-event][data-gtm-type=${type}]`,
  ) as HTMLElement | null;
  return {
    target,
    gtmEvent: target?.getAttribute("data-gtm-event") ?? null,
  };
}

function GTMTracker({ children }: React.PropsWithChildren) {
  const isClient = useIsClient();

  const handleClick: React.MouseEventHandler<HTMLElement> = useDebounceCallback(
    (event) => {
      const { target, gtmEvent } = findGtmEventTarget(
        event.target,
        GtmEventType.Click,
      );
      if (!target || !gtmEvent) return;

      switch (gtmEvent) {
        default: {
          pushGTMEvent(gtmEvent);
        }
      }
    },
  );

  useEffect(() => {
    if (isClient) initializeGTM();
  }, [isClient]);

  return (
    <div id="gtm-tracker" className="zeus:contents" onClick={handleClick}>
      {children}
    </div>
  );
}

export default GTMTracker;
