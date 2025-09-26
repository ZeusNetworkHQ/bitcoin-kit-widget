"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";

import Button from "./Button";
import ClaimTestnetModal from "./Modals/ClaimTestnet";
import ConnectWalletModal from "./Modals/ConnectWallet";
import Icon from "./Icon/Icon";

export default function Header() {
  const wallet = useWallet();

  const [isClaimTestnetModalOpen, setIsClaimTestnetModalOpen] =
    useState<boolean>(false);

  const [isConnectWalletModalOpen, setIsConnectWalletModalOpen] =
    useState<boolean>(false);

  return (
    <div className="relative z-50">
      <ClaimTestnetModal
        onClose={() => setIsClaimTestnetModalOpen(false)}
        isOpen={isClaimTestnetModalOpen}
      />
      <ConnectWalletModal
        onClose={() => setIsConnectWalletModalOpen(false)}
        isOpen={isConnectWalletModalOpen}
      />
      <header className="relative z-50 flex items-center justify-between w-full py-12 lg:py-16">
        <div className="flex items-center gap-x-32">
          <a href={process.env.NEXT_PUBLIC_ZEUS_STACK_HOME_LINK}>
            <img
              src="/branding/logo-primary.svg"
              alt="ZeusStack Logo"
              className="h-20 mt-1"
            />
          </a>
          <div className="flex items-center justify-center gap-x-16">
            <a
              href={process.env.NEXT_PUBLIC_GITHUB_LINK}
              className="transition hover:text-sys-color-text-primary"
            >
              <Icon name="Github" size={16 as 18}></Icon>
            </a>
            <a
              href={process.env.NEXT_PUBLIC_X_LINK}
              className="transition hover:text-sys-color-text-primary"
            >
              <Icon name="X" size={16 as 18}></Icon>
            </a>
          </div>
        </div>
        <div className="flex items-center gap-x-40">
          <div className="items-center gap-x-32 hidden md:flex">
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-sys-color-text-secondary hover:text-sys-color-text-primary transition"
              href={process.env.NEXT_PUBLIC_WIDGET_GITHUB_LINK}
            >
              View Docs
            </a>
            <div
              className="cursor-pointer text-sm font-medium text-sys-color-text-secondary hover:text-sys-color-text-primary transition"
              onClick={() => {
                setIsClaimTestnetModalOpen(true);
              }}
            >
              Claim tBTC
            </div>
          </div>
          <Button
            onClick={() => {
              if (wallet.connected) return wallet.disconnect();
              setIsConnectWalletModalOpen(true);
            }}
            theme="glass"
            label={wallet.connected ? "Connected" : "Connect Wallet"}
            icon="Wallet"
            isLoading={isConnectWalletModalOpen}
          />
        </div>
      </header>
    </div>
  );
}
