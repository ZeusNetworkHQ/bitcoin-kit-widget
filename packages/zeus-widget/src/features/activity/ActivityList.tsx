import { useEffect } from "react";

import { useWallet } from "@solana/wallet-adapter-react";
import { satoshiToBtc } from "@zeus-widget/core";
import BigNumber from "bignumber.js";

import {
  getInteractionDetails,
  getInteractionLink,
  getStatus,
} from "./helpers";

import Icon from "@/components/Icon";
import { useCoreConfig } from "@/contexts/CorePoolProvider";
import useInteractions from "@/hooks/useInteractions";
import { cn } from "@/utils/misc";
import { toRelativeTime } from "@/utils/time";

export interface ActivityListProps {
  selected?: boolean;
}

function ActivityList({ selected }: ActivityListProps) {
  const wallet = useWallet();
  const { solanaNetwork, bitcoinNetwork } = useCoreConfig();

  const { data: interactions = [], mutate } = useInteractions(wallet.publicKey);

  useEffect(() => {
    if (selected) mutate();
  }, [selected, mutate]);

  if (interactions.length === 0)
    return (
      <div className="zeus:flex zeus:flex-col zeus:items-center zeus:justify-center zeus:h-[184px] zeus:text-[#AEADB8]">
        <p className="zeus:heading-heading6">No Activity Found</p>
        <p className="zeus:body-body2-semibold">
          Your transaction history will appear here.
        </p>
      </div>
    );

  return (
    <div className="zeus:flex zeus:flex-col zeus:gap-[10px]">
      {interactions.map((interaction) => {
        const status = getStatus(interaction);
        const getStatusColorClass = () => {
          switch (status) {
            case "complete":
              return "zeus:text-[#72F088]";
            case "failed":
              return "zeus:text-[#F44336]";
            case "initial":
              return "zeus:text-[#AEADB8]";
            case "processing":
            default:
              return "zeus:text-[#FFEB83]";
          }
        };

        const interactionDetails = getInteractionDetails(interaction);

        return (
          <a
            key={interaction.interactionId}
            href={getInteractionLink(interaction.interactionId, {
              bitcoinNetwork,
              solanaNetwork,
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="zeus:p-[8px] zeus:pb-0 zeus:bg-[#27272D] zeus:rounded-[12px] zeus:text-[#AEADB8]"
          >
            <div className="zeus:flex zeus:flex-row zeus:items-center zeus:justify-between zeus:px-[12px] zeus:py-[8px] zeus:body-body2-medium zeus:bg-[#16161BBF] zeus:rounded-[8px]">
              <div>{toRelativeTime(interaction.initiatedAt * 1000)}</div>
              <div className={cn("zeus:capitalize", getStatusColorClass())}>
                {status}
              </div>
            </div>

            <div className="zeus:flex zeus:flex-row zeus:items-center zeus:gap-[6px] zeus:body-body1-semibold zeus:text-[#F1F0F3] zeus:w-full zeus:text-start">
              <div className="zeus:flex-1 zeus:flex zeus:flex-row zeus:items-center zeus:gap-[8px] zeus:p-[8px]">
                <Icon
                  variant={`brand.${interactionDetails.source.toLowerCase()}`}
                />
                <div>
                  {[
                    satoshiToBtc(interaction.amount).toFormat(),
                    interactionDetails.source,
                  ].join(" ")}
                </div>
              </div>

              <div className="zeus:h-[14px] zeus:w-[14px] zeus:flex zeus:flex-row zeus:justify-center zeus:items-center">
                {"→"}
              </div>

              <div className="zeus:flex-1 zeus:flex zeus:flex-row zeus:items-center zeus:gap-[8px] zeus:p-[8px]">
                <Icon
                  variant={`brand.${interactionDetails.destination.toLowerCase()}`}
                />
                <div>
                  {[
                    satoshiToBtc(
                      new BigNumber(interaction.amount)
                        .minus(interaction.minerFee)
                        .minus(interaction.serviceFee)
                    ).toFormat(),
                    interactionDetails.destination,
                  ].join(" ")}
                </div>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}

export default ActivityList;
