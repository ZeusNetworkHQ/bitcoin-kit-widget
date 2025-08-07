import { useState } from "react";

import {
  type PopoverContentProps,
  type PopoverProps,
  type PopoverTriggerProps,
} from "@radix-ui/react-popover";

import ActivityPage from "./activity";
import DepositPage from "./deposit";
import WidgetProviders, { type WidgetProvidersProps } from "./provider";
import WithdrawPage from "./withdraw";

import type {
  DialogContentProps,
  DialogProps,
  DialogTriggerProps,
} from "@radix-ui/react-dialog";

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
import WalletModalProvider from "@/components/WalletModalProvider";
import PortalHub from "@/contexts/PortalHub";
import { WidgetTab } from "@/types";
import { cn } from "@/utils/misc";

export type WidgetWidgetConfig = Omit<WidgetProvidersProps, "children">;

interface WidgetProps {
  className?: string;
}

function WidgetBase({ className }: WidgetProps) {
  const [selectedTab, setSelectedTab] = useState(WidgetTab.DEPOSIT);

  const tabConfigs = [
    {
      title: "Deposit",
      value: WidgetTab.DEPOSIT,
      icon: "connect" as const,
      content: <DepositPage />,
    },
    {
      title: "Withdraw",
      value: WidgetTab.WITHDRAW,
      icon: "withdraw" as const,
      content: <WithdrawPage />,
    },
    {
      title: "Activity",
      value: WidgetTab.ACTIVITY,
      icon: "clock" as const,
      content: <ActivityPage selected={selectedTab === WidgetTab.ACTIVITY} />,
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
              "zeus:text-[#FFABFE] zeus:bg-[#FD82FF1A]",
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
            href: "https://x.com/ZeusStackDev",
          },
          {
            variant: "brand.gitbook",
            label: "GitBook",
            href: "https://zeusnetwork.xyz/developers",
          },
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
    <div
      className={cn(
        "zeus:flex zeus:flex-col zeus:transition zeus:pb-[4px]",
        className,
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
  );
}

// --- INTEGRATED VARIANT ---

export interface IntegratedWidgetProps
  extends React.HTMLAttributes<HTMLDivElement> {
  config?: WidgetWidgetConfig;
}

function Widget({ config, className, ...props }: IntegratedWidgetProps) {
  return (
    <div
      {...props}
      className={cn(
        "zeus:bg-[#202027] zeus:border zeus:border-solid zeus:border-[#8B8A9E4D] zeus:p-[12px] zeus:pt-0 zeus:w-[408px] zeus:max-w-[calc(100vw_-_32px)] zeus:rounded-[16px] zeus:max-h-[75vh] zeus:overflow-y-auto zeus:[&_.widget-tabs]:pt-[12px]",
        className,
      )}
    >
      <WidgetProviders {...config}>
        <WalletModalProvider>
          <WidgetBase />
        </WalletModalProvider>
      </WidgetProviders>
    </div>
  );
}

// --- POPOVER VARIANT ---

export interface PopoverWidgetProps extends PopoverProps {
  config?: WidgetWidgetConfig;
}
function PopoverWidget({ config, children, ...props }: PopoverWidgetProps) {
  return (
    <Popover {...props}>
      <WidgetProviders {...config}>{children}</WidgetProviders>
    </Popover>
  );
}

export type PopoverWidgetContentProps = Omit<PopoverContentProps, "children">;

PopoverWidget.Content = function PopoverWidgetContent({
  className,
  ...props
}: PopoverWidgetContentProps) {
  return (
    <>
      <PopoverContent {...props}>
        <div
          className={cn(
            "zeus:bg-[#202027] zeus:border zeus:border-solid zeus:border-[#8B8A9E4D] zeus:p-[12px] zeus:pt-0 zeus:w-[408px] zeus:max-w-[calc(100vw_-_32px)] zeus:rounded-[16px] zeus:max-h-[75vh] zeus:overflow-y-auto zeus:[&_.widget-tabs]:pt-[12px]",
            className,
          )}
        >
          <WalletModalProvider>
            <WidgetBase />
          </WalletModalProvider>
        </div>
      </PopoverContent>
    </>
  );
};

export type PopoverWidgetTriggerProps = PopoverTriggerProps;

PopoverWidget.Trigger = PopoverTrigger;

Widget.Popover = PopoverWidget;

// --- DIALOG VARIANT ---

export interface DialogWidgetProps extends DialogProps {
  config?: WidgetWidgetConfig;
}

function DialogWidget({ config, children, ...props }: DialogWidgetProps) {
  return (
    <Dialog {...props}>
      <WidgetProviders {...config}>{children}</WidgetProviders>
    </Dialog>
  );
}

export type DialogWidgetContentProps = Omit<DialogContentProps, "children">;

DialogWidget.Content = function DialogWidgetContent({
  className,
  ...props
}: DialogWidgetContentProps) {
  return (
    <>
      <DialogOverlay>
        <div className="zeus:w-screen zeus:h-screen zeus:left-0 zeus:top-0 zeus:bg-[#0F0F1280] zeus:backdrop-blur-[8px]" />
      </DialogOverlay>

      <DialogContent
        {...props}
        className={cn(
          "zeus:bg-[#202027] zeus:border zeus:border-solid zeus:border-[#8B8A9E4D] zeus:p-[12px] zeus:w-[408px] zeus:rounded-[16px] zeus:max-h-[calc(100vh_-_32px)] zeus:overflow-y-auto",
          className,
        )}
      >
        <WalletModalProvider>
          <DialogTitle hidden />
          <WidgetBase />
        </WalletModalProvider>
      </DialogContent>
    </>
  );
};

export type DialogWidgetTriggerProps = DialogTriggerProps;

DialogWidget.Trigger = DialogTrigger;

Widget.Dialog = DialogWidget;

Widget.Portal = PortalHub.Portal;

export default Widget;

export { PopoverWidget, DialogWidget };
