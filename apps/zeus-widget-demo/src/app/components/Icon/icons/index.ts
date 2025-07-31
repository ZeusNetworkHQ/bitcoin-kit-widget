import { XIcon } from "./X";
import { DiscordIcon } from "./Discord";
import Gitbook from "./Gitbook";
import { ArrowTopRight } from "./ArrowTopRight";
import { ChevronDown } from "./ChevronDown";
import { ModalIcon } from "./Modal";
import { IntegratedIcon } from "./Integrated";
import { WidgetIcon } from "./Widget";

export const IconComponents = {
  Discord: DiscordIcon,
  GitBook: Gitbook,
  X: XIcon,
  ArrowTopRight: ArrowTopRight,
  ChevronDown: ChevronDown,
  ModalIcon: ModalIcon,
  WidgetIcon: WidgetIcon,
  IntegratedIcon: IntegratedIcon,
} as const;

export type IconName = keyof typeof IconComponents;
