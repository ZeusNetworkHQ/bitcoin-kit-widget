import BtcIcon from "./brands/btc.svg?react";
import GitbookIcon from "./brands/gitbook.svg?react";
import TwitterIcon from "./brands/twitter.svg?react";
import ZBtcIcon from "./brands/zbtc.svg?react";
import ZeusBWIcon from "./brands/zeus-bw.svg?react";
import ClearIcon from "./icons/clear.svg?react";
import ClockIcon from "./icons/clock.svg?react";
import ConnectIcon from "./icons/connect.svg?react";
import CopyIcon from "./icons/copy.svg?react";
import DisconnectIcon from "./icons/disconnect.svg?react";
import ErrorIcon from "./icons/error.svg?react";
import WalletSmIcon from "./icons/wallet-sm.svg?react";
import WalletIcon from "./icons/wallet.svg?react";
import WithdrawIcon from "./icons/withdraw.svg?react";

export const Variant = {
  connect: ConnectIcon,
  copy: CopyIcon,
  disconnect: DisconnectIcon,
  withdraw: WithdrawIcon,
  clock: ClockIcon,
  wallet: WalletIcon,
  error: ErrorIcon,
  clear: ClearIcon,
  "wallet-sm": WalletSmIcon,

  "brand.btc": BtcIcon,
  "brand.zeus-bw": ZeusBWIcon,
  "brand.twitter": TwitterIcon,
  "brand.gitbook": GitbookIcon,
  "brand.zbtc": ZBtcIcon,
} as const;

export type Variant = keyof typeof Variant;

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, "src"> {
  variant: Variant | (string & {});
  size?: number | string;
}

function Icon({
  size = 18,
  height = size,
  width = size,
  variant,
  ...props
}: IconProps) {
  const SvgIcon = Variant[variant as Variant] || "svg";

  if (!SvgIcon) {
    console.warn(`[Icon] Unknown icon variant: ${variant}`);
  }

  return (
    <SvgIcon
      {...props}
      width={width}
      height={height}
      style={{ width, height, ...props.style }}
    />
  );
}

export default Icon;
