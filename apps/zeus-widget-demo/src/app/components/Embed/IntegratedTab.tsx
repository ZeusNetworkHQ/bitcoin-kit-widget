"use client";

import { useWidgetConfig } from "@/providers/WidgetConfigProvider";
import { ZeusWidget } from "@zeus-network/zeus-stack-widget";

export default function IntegratedTab() {
  const config = useWidgetConfig();

  return (
    <div className="h-auto relative flex flex-col items-center justify-center p-16">
      <div className="dashed-border"></div>
      <ZeusWidget className="z-[41]" config={config} />
    </div>
  );
}
