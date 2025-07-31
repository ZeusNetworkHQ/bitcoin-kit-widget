"use client";

import { useState } from "react";
import Button from "./Button";
import ClaimTestnetModal from "./Modals/ClaimTestnet";
import ConnectWalletModal from "./Modals/ConnectWallet";

export default function Header() {
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
        <img
          src="/branding/logo-primary.svg"
          alt="ZeusStack Logo"
          className="h-20"
        />
        <div className="flex items-center gap-x-40">
          <div className="items-center gap-x-32 hidden md:flex">
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-sys-color-text-secondary hover:text-sys-color-text-primary transition"
              href={process.env.NEXT_PUBLIC_DOCS_LINK}
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
              setIsConnectWalletModalOpen(true);
            }}
            theme="glass"
            label="Connect Wallet"
            icon="Wallet"
            isLoading={isConnectWalletModalOpen}
          />
        </div>
      </header>
    </div>
  );
}
