import { createContext, useContext, useMemo } from "react";

import { useConnection } from "@solana/wallet-adapter-react";
import {
  Clients,
  CoreConfig,
  Models,
  Programs,
  type CoreConfigParams,
} from "@zeus-widget/core";

interface CorePool {
  coreConfig: CoreConfig;
  aresClient: Clients.Ares;
  unisatClient: Clients.Unisat;
  hermesClient: Clients.Hermes;
  bianceClient: Clients.Binance;
  interactionModel: Models.Interaction;
  utxoModel: Models.Utxo;
  edraModel: Models.EntityDerivedReserveAddress;
  reserveSettingModel: Models.ReserveSetting;
  tokenAccountModel: Models.TokenAccount;
}

const CorePoolContext = createContext<CorePool | null>(null);

interface CorePoolProviderProps
  extends Pick<CoreConfigParams, "bitcoinNetwork" | "solanaNetwork"> {
  children: React.ReactNode;
}

function CorePoolProvider({
  children,
  bitcoinNetwork,
  solanaNetwork,
}: CorePoolProviderProps) {
  const { connection } = useConnection();
  const pool = useMemo<CorePool>(() => {
    const coreConfig = new CoreConfig({
      bitcoinNetwork: bitcoinNetwork,
      solanaNetwork: solanaNetwork,
      solanaConnection: connection,
    });

    const aresClient = new Clients.Ares({ coreConfig });
    const hermesClient = new Clients.Hermes({ coreConfig });
    const unisatClient = new Clients.Unisat({ coreConfig });
    const bianceClient = new Clients.Binance({ coreConfig });
    const forwardPool = { coreConfig, aresClient, hermesClient, unisatClient };

    const interactionModel = new Models.Interaction(forwardPool);
    const utxoModel = new Models.Utxo(forwardPool);
    const reserveSettingModel = new Models.ReserveSetting(forwardPool);
    const tokenAccountModel = new Models.TokenAccount(forwardPool);
    const edraModel = new Models.EntityDerivedReserveAddress({
      ...forwardPool,
      reserveSettingModel,
    });

    return {
      coreConfig,
      aresClient,
      unisatClient,
      hermesClient,
      bianceClient,
      interactionModel,
      utxoModel,
      edraModel,
      reserveSettingModel,
      tokenAccountModel,
    };
  }, [connection, bitcoinNetwork, solanaNetwork]);

  return (
    <CorePoolContext.Provider value={pool}>{children}</CorePoolContext.Provider>
  );
}

export default CorePoolProvider;

const useCorePool = () => {
  const pool = useContext(CorePoolContext);
  if (!pool) {
    throw new Error("useCorePool must be used within a CorePoolProvider");
  }
  return pool;
};

export const useCoreConfig = () => {
  const pool = useCorePool();
  return useMemo(() => pool.coreConfig, [pool]);
};

export const useBinanceClient = () => {
  const pool = useCorePool();
  return useMemo(() => pool.bianceClient, [pool]);
};

export const useInteractionModel = () => {
  const pool = useCorePool();
  return useMemo(() => pool.interactionModel, [pool]);
};

export const useUtxoModel = () => {
  const pool = useCorePool();
  return useMemo(() => pool.utxoModel, [pool]);
};

export const useEdraModel = () => {
  const pool = useCorePool();
  return useMemo(() => pool.edraModel, [pool]);
};

export const useTokenAccountModel = () => {
  const pool = useCorePool();
  return useMemo(() => pool.tokenAccountModel, [pool]);
};

export const useDepositProgram = () => {
  const pool = useCorePool();
  return useMemo(() => new Programs.Deposit(pool), [pool]);
};

export const useWithdrawProgram = () => {
  const pool = useCorePool();
  return useMemo(() => new Programs.Withdraw(pool), [pool]);
};
