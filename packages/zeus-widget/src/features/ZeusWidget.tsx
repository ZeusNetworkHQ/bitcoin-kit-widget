import { useState } from "react";

import ActivityPage from "./activity";
import DepositPage from "./deposit";
import WithdrawPage from "./withdraw";
import ZeusWidgetProviders, {
  type ZeusWidgetProvidersProps,
} from "./ZeusWidgetProviders";

import type { DialogContentProps, DialogProps } from "@radix-ui/react-dialog";
import type {
  PopoverContentProps,
  PopoverProps,
} from "@radix-ui/react-popover";

import Icon from "@/components/Icon";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ZeusWidgetTab } from "@/types";
import { cn } from "@/utils/misc";

type ZeusWidgetWidgetConfig = Omit<ZeusWidgetProvidersProps, "children">;

interface ZeusWidgetProps {
  config?: ZeusWidgetWidgetConfig;
  className?: string;
}

function ZeusWidget({ config, className }: ZeusWidgetProps) {
  const [selectedTab, setSelectedTab] = useState(ZeusWidgetTab.DEPOSIT);

  const tabConfigs = [
    {
      title: "Deposit",
      value: ZeusWidgetTab.DEPOSIT,
      icon: "connect" as const,
      content: <DepositPage />,
    },
    {
      title: "Withdraw",
      value: ZeusWidgetTab.WITHDRAW,
      icon: "withdraw" as const,
      content: <WithdrawPage />,
    },
    {
      title: "Activity",
      value: ZeusWidgetTab.ACTIVITY,
      icon: "clock" as const,
      content: (
        <ActivityPage selected={selectedTab === ZeusWidgetTab.ACTIVITY} />
      ),
    },
  ];

  const tabsElement = (
    <>
      {tabConfigs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          className={cn(
            "zeus:grow zeus:p-[10px] zeus:flex zeus:flex-row zeus:items-center zeus:justify-center zeus:body-body2-semibold zeus:rounded-[12px] zeus:cursor-pointer zeus:text-[#8B8A9E] zeus:h-[40px] zeus:transition-colors zeus:gap-[8px]",
            selectedTab === tab.value &&
              "zeus:text-[#FFABFE] zeus:bg-[#FD82FF1A]"
          )}
          onClick={() => setSelectedTab(tab.value)}
        >
          <Icon variant={tab.icon} />
          {tab.title}
        </button>
      ))}
    </>
  );

  const contentsElement = (
    <>
      {tabConfigs.map((tab) => (
        <div
          key={tab.value}
          className={tab.value !== selectedTab ? "zeus:hidden" : "contents"}
        >
          {tab.content}
        </div>
      ))}
    </>
  );

  const footerLinksElement = (
    <div className="zeus:flex zeus:flex-row zeus:items-center zeus:gap-[16px]">
      {(
        [
          {
            variant: "brand.zeus-bw",
            label: "Zeus BW",
            href: "https://zeusnetwork.xyz",
          },
          {
            variant: "brand.twitter",
            label: "X",
            href: "https://x.com/ApolloByZeus",
          },
          { variant: "brand.gitbook", label: "GitBook", href: undefined },
        ] as const
      ).map((item) => (
        <a
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="zeus:hover:text-[#C7C5D1] zeus:transition-colors"
        >
          <Icon variant={item.variant} />
        </a>
      ))}
    </div>
  );

  return (
    <ZeusWidgetProviders {...config}>
      <div
        className={cn(
          "zeus:flex zeus:flex-col zeus:transition zeus:pb-[4px]",
          className
        )}
      >
        <div className="widget-tabs zeus:flex zeus:flex-row zeus:gap-[4px] zeus:items-center zeus:w-full zeus:mb-[12px] zeus:pb-[12px] zeus:transition-all zeus:sticky zeus:top-0 zeus:bg-[#202027]">
          {tabsElement}
        </div>

        {contentsElement}

        <div className="zeus:flex zeus:flex-row zeus:justify-between zeus:items-center zeus:gap-[8px] zeus:mt-[16px] zeus:text-[#8B8A9E] zeus:px-[8px]">
          {footerLinksElement}
          <p className="zeus:caption-caption">Powered by Zeus</p>
        </div>
      </div>
    </ZeusWidgetProviders>
  );
}

export interface ZeusWidgetPopoverProps
  extends Pick<PopoverProps, "open" | "defaultOpen" | "onOpenChange">,
    PopoverContentProps {
  config?: ZeusWidgetWidgetConfig;
  children: React.ReactElement;
}

// --- POPOVER VARIANT ---

ZeusWidget.Popover = ({
  config,
  children,
  open,
  defaultOpen,
  onOpenChange,
  ...props
}: ZeusWidgetPopoverProps) => {
  return (
    <Popover open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent {...props}>
        <div className="zeus:bg-[#202027] zeus:border zeus:border-solid zeus:border-[#8B8A9E4D] zeus:p-[12px] zeus:pt-0 zeus:w-[408px] zeus:max-w-[calc(100vw_-_32px)] zeus:rounded-[16px] zeus:max-h-[75vh] zeus:overflow-y-auto zeus:[&_.widget-tabs]:pt-[12px]">
          <ZeusWidget config={config} />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export interface ZeusWidgetDialogProps
  extends Pick<DialogProps, "open" | "defaultOpen" | "onOpenChange">,
    DialogContentProps {
  config?: ZeusWidgetWidgetConfig;
  children: React.ReactElement;
}

// --- DIALOG VARIANT ---

ZeusWidget.Dialog = ({
  config,
  children,
  open,
  defaultOpen,
  className,
  onOpenChange,
  ...props
}: ZeusWidgetDialogProps) => {
  return (
    <Dialog open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogOverlay>
        <div
          className={cn(
            "zeus:fixed zeus:inset-0 zeus:bg-black/50 zeus:opacity-0 zeus:transition-opacity zeus:pointer-events-none"
          )}
        />
      </DialogOverlay>

      <DialogContent
        {...props}
        className={cn(
          "zeus:bg-[#202027] zeus:border zeus:border-solid zeus:border-[#8B8A9E4D] zeus:p-[12px] zeus:w-[408px] zeus:rounded-[16px] zeus:max-h-[calc(100vh_-_32px)] zeus:overflow-y-auto",
          className
        )}
      >
        <DialogTitle hidden />
        <ZeusWidget config={config} />
      </DialogContent>
    </Dialog>
  );
};

export default ZeusWidget;
