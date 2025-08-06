import { createContext, useContext, useMemo, useRef } from "react";

import { useConnection } from "@solana/wallet-adapter-react";
import {
  ZeusCore,
  ZeusService,
  type CreateZeusCoreParams,
} from "@zeus-network/client";

interface Config {
  core: ZeusCore;
  onError: (error: Error) => void;
  onSuccess: (message: string) => void;
}

const ConfigContext = createContext<Config | null>(null);

export default ConfigContext;

interface ConfigProviderProps
  extends Pick<CreateZeusCoreParams, "solanaNetwork" | "bitcoinNetwork">,
    Partial<Pick<Config, "onError" | "onSuccess">> {
  children: React.ReactNode;
}

export function ConfigProvider({
  children,
  solanaNetwork,
  bitcoinNetwork,
  onError,
  onSuccess,
}: ConfigProviderProps) {
  const { connection: solanaConnection } = useConnection();

  const core = useMemo(() => {
    return new ZeusCore({
      solanaConnection,
      solanaNetwork,
      bitcoinNetwork,
    });
  }, [solanaConnection, solanaNetwork, bitcoinNetwork]);

  const handlersRef = useRef({ onError, onSuccess });
  handlersRef.current = { onError, onSuccess };

  return (
    <ConfigContext.Provider
      value={useMemo(
        () => ({
          core,
          onError: (...args) => handlersRef.current.onError?.(...args),
          onSuccess: (...args) => handlersRef.current.onSuccess?.(...args),
        }),
        [core],
      )}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export const useErrorHandler = () => {
  const config = useContext(ConfigContext);
  if (!config) {
    throw new Error("useErrorHandler must be used within a ConfigProvider");
  }
  return config.onError;
};

export const useSuccessHandler = () => {
  const config = useContext(ConfigContext);
  if (!config) {
    throw new Error("useSuccessHandler must be used within a ConfigProvider");
  }
  return config.onSuccess;
};

export const useConfig = () => {
  const config = useContext(ConfigContext);
  if (!config) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return config.core;
};

export const useZeusService = <T extends typeof ZeusService>(
  Service: T,
  params?: Omit<ConstructorParameters<T>[0], "core">,
): InstanceType<T> => {
  const config = useContext(ConfigContext);
  if (!config) {
    throw new Error("useZeusService must be used within a ConfigProvider");
  }
  return useMemo(
    () => config.core.getOrInstall(Service, params),
    [config.core, Service, params],
  );
};
