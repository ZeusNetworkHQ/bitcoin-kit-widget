import { useWallet } from "@solana/wallet-adapter-react";

import ActivityList from "./ActivityList";

import Icon from "@/components/Icon";
import ZeusButton from "@/components/ZeusButton";
import useConnectWallet from "@/hooks/useConnectWallet";

interface ActivityPageProps {
  selected?: boolean;
}

function ActivityPage({ selected }: ActivityPageProps) {
  const { publicKey } = useWallet();
  const connectWallet = useConnectWallet();

  if (publicKey) return <ActivityList selected={selected} />;

  return (
    <div className="zeus:flex zeus:flex-col zeus:px-[4px]">
      <div className="zeus:flex zeus:flex-col zeus:justify-center zeus:gap-[4px] zeus:text-center zeus:h-[184px]">
        <p className="zeus:heading-heading6">Require Wallet Connection</p>
        <p className="zeus:body-body2-semibold">
          Connect wallet to check your transaction history.
        </p>
      </div>

      <ZeusButton
        variant="primary"
        className="zeus:w-full"
        onClick={() => connectWallet()}
      >
        <Icon variant="wallet" />
        Connect Wallet
      </ZeusButton>
    </div>
  );
}

export default ActivityPage;
