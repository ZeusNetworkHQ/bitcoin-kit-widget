import { useState } from "react";

import { useWallet } from "@solana/wallet-adapter-react";
import {
  ApolloAccountCreationError,
  EDRA_CREATE_FEE_SOL,
  EntityDerivedReserveAddressModel,
} from "@zeus-network/client";

import btcTokenDiagram from "@/assets/btc-token-diagram.svg?url";
import Icon from "@/components/Icon";
import ZeusButton from "@/components/ZeusButton";
import { useErrorHandler, useZeusService } from "@/contexts/ConfigContext";

interface CreateApolloAccountProps {
  onComplete?: () => void;
}

function CreateApolloAccount({ onComplete }: CreateApolloAccountProps) {
  const [loading, setLoading] = useState(false);
  const wallet = useWallet();
  const edraModel = useZeusService(EntityDerivedReserveAddressModel);

  const handleError = useErrorHandler();

  const handleComplete = async () => onComplete?.();

  const createApolloAccount = async () => {
    try {
      setLoading(true);
      await edraModel.create(wallet);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await handleComplete().catch(() => {});
    } catch (error) {
      if (error instanceof Error) {
        handleError(new ApolloAccountCreationError(error));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="zeus:flex zeus:flex-col">
      <div className="zeus:flex zeus:flex-row zeus:items-center zeus:justify-center zeus:mb-[8px] zeus:h-[114px] zeus:px-[32px]">
        <Icon variant="brand.btc" size={28} className="zeus:shrink-0" />
        <div className="zeus:flex zeus:grow zeus:relative zeus:justify-center zeus:items-center">
          <div className="zeus:absolute zeus:h-[1px] zeus:w-full zeus:bg-[linear-gradient(90deg,#8B8A9E00_1.53%,#FFBF83_18.75%,#8D64D9_81.03%,#8B8A9E00_97.33%)]" />
          <img src={btcTokenDiagram} className="zeus:z-2" />
        </div>
        <Icon variant="brand.zbtc" size={28} className="zeus:shrink-0" />
      </div>

      <div className="zeus:flex zeus:flex-col zeus:gap-[4px] text-[#F1F0F3] zeus:text-center zeus:mb-[20px] zeus:px-[8px]">
        <p className="zeus:heading-heading6">Activate BTC Deposit</p>
        <p className="zeus:body-body2-semibold">
          To deposit BTC, a one-time fee of{" "}
          <span className="zeus:text-[#FFEB83]">{EDRA_CREATE_FEE_SOL} SOL</span>{" "}
          is required.
        </p>
      </div>

      <ZeusButton
        disabled={loading}
        variant="primary"
        className="zeus:w-full"
        onClick={createApolloAccount}
      >
        Pay {EDRA_CREATE_FEE_SOL} SOL & Continue
      </ZeusButton>
    </div>
  );
}

export default CreateApolloAccount;
