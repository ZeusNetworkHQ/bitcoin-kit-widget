import { XIcon } from "./X";
import { DiscordIcon } from "./Discord";
import Gitbook from "./Gitbook";
import { ArrowTopRight } from "./ArrowTopRight";
import { ChevronDown } from "./ChevronDown";
import { ModalIcon } from "./Modal";
import { IntegratedIcon } from "./Integrated";
import { WidgetIcon } from "./Widget";
import { WalletIcon } from "./Wallet";
import { CloseIcon } from "./Close";
import { PhantomIcon } from "./Phantom";
import { MusesIcon } from "./Muses";
import { OkxIcon } from "./Okx";
import { XverseIcon } from "./Xverse";
import { UnisatIcon } from "./Unisat";
import { TBtc } from "./TBtc";

export const IconComponents = {
  Discord: DiscordIcon,
  GitBook: Gitbook,
  X: XIcon,
  ArrowTopRight: ArrowTopRight,
  ChevronDown: ChevronDown,
  ModalIcon: ModalIcon,
  Wallet: WalletIcon,
  WidgetIcon: WidgetIcon,
  IntegratedIcon: IntegratedIcon,
  Close: CloseIcon,
  Phantom: PhantomIcon,
  Muses: MusesIcon,
  Okx: OkxIcon,
  Xverse: XverseIcon,
  Unisat: UnisatIcon,
  TBtc,
} as const;

export type IconName = keyof typeof IconComponents;
