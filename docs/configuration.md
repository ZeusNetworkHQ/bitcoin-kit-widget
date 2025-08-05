# Configuration Guide

A comprehensive guide to configuring Zeus Widget components in your application. This guide covers all available configuration options, network settings, wallet integration, and customization options.

## Table of Contents

- [Basic Configuration](#basic-configuration)
- [Network Configuration](#network-configuration)
- [Wallet Configuration](#wallet-configuration)
- [Event Handlers](#event-handlers)
- [Style Configuration](#style-configuration)
- [Integration Examples](#integration-examples)
- [Development vs Production](#development-vs-production)
- [Troubleshooting](#troubleshooting)

## Basic Configuration

All Zeus Widget components accept a `config` prop with the following interface:

```tsx
interface ZeusWidgetConfig {
  bitcoinNetwork?: BitcoinNetwork;
  solanaNetwork?: SolanaNetwork;
  bitcoinWallets?: (BaseConnector | null)[];
  onSuccess?: (message: string) => void;
  onError?: (error: Error) => void;
}
```

### Minimal Configuration

```tsx
import { ZeusWidget, BitcoinNetwork, SolanaNetwork } from "zeus-widget";

const config = {
  bitcoinNetwork: BitcoinNetwork.Regtest,
  solanaNetwork: SolanaNetwork.Devnet,
};

<ZeusWidget config={config} />;
```

## Network Configuration

### Bitcoin Networks

Zeus Widget supports three Bitcoin networks:

| Network     | Value                    | Use Case                                                |
| ----------- | ------------------------ | ------------------------------------------------------- |
| **Mainnet** | `BitcoinNetwork.Mainnet` | Production Bitcoin network                              |
| **Testnet** | `BitcoinNetwork.Testnet` | Bitcoin test network                                    |
| **Regtest** | `BitcoinNetwork.Regtest` | Local development network (recommended for development) |

```tsx
import { BitcoinNetwork } from "zeus-widget";

// Development
const config = {
  bitcoinNetwork: BitcoinNetwork.Regtest, // Recommended for development
};

// Production
const config = {
  bitcoinNetwork: BitcoinNetwork.Mainnet,
};
```

### Solana Networks

Zeus Widget supports three Solana networks:

| Network     | Value                   | RPC Endpoint                                |
| ----------- | ----------------------- | ------------------------------------------- |
| **Mainnet** | `SolanaNetwork.Mainnet` | Solana mainnet-beta                         |
| **Devnet**  | `SolanaNetwork.Devnet`  | Solana devnet (recommended for development) |
| **Testnet** | `SolanaNetwork.Testnet` | Solana testnet                              |

```tsx
import { SolanaNetwork } from "zeus-widget";

// Development
const config = {
  solanaNetwork: SolanaNetwork.Devnet, // Recommended for development
};

// Production
const config = {
  solanaNetwork: SolanaNetwork.Mainnet,
};
```

### Supported Network Combinations

Not all network combinations are supported. Here are the valid combinations:

| Bitcoin Network | Solana Network | Environment | Status       |
| --------------- | -------------- | ----------- | ------------ |
| Mainnet         | Mainnet        | Production  | ✅ Supported |
| Testnet         | Devnet         | Development | ✅ Supported |
| Regtest         | Devnet         | Development | ✅ Supported |

## Wallet Configuration

### Bitcoin Wallet Connectors

Configure which Bitcoin wallets users can connect to:

```tsx
import { Connectors, useDeriveWalletConnector } from "zeus-widget/bitcoin";

// Available wallet connectors
const bitcoinWallets = [
  new Connectors.PhantomConnector(),
  new Connectors.UniSatConnector(),
  new Connectors.OKXConnector(),
  new Connectors.XverseConnector(),
  new Connectors.MusesConnector(),
];

const config = {
  bitcoinWallets,
};
```

### Derive Wallet (Development)

The Derive Wallet allows users to create a Bitcoin wallet from their Solana wallet, perfect for development:

```tsx
import { useDeriveWalletConnector } from "zeus-widget/bitcoin";

function YourComponent() {
  const deriveWallet = useDeriveWalletConnector(BitcoinNetwork.Regtest);

  const config = {
    bitcoinNetwork: BitcoinNetwork.Regtest,
    solanaNetwork: SolanaNetwork.Devnet,
    bitcoinWallets: [deriveWallet], // No external wallet extensions needed!
  };

  return <ZeusWidget.Popover config={config}>...</ZeusWidget.Popover>;
}
```

### Wallet Compatibility

| Wallet            | Mainnet | Testnet | Regtest | Connector                  |
| ----------------- | ------- | ------- | ------- | -------------------------- |
| **Phantom**       | ✅      | ❌      | ❌      | `PhantomConnector`         |
| **UniSat**        | ✅      | ✅      | ❌      | `UniSatConnector`          |
| **OKX**           | ✅      | ✅      | ❌      | `OKXConnector`             |
| **Xverse**        | ✅      | ✅      | ✅      | `XverseConnector`          |
| **Muses**         | ❌      | ❌      | ✅      | `MusesConnector`           |
| **Derive Wallet** | ❌      | ❌      | ✅      | `useDeriveWalletConnector` |

## Event Handlers

### Success Handler

Called when operations complete successfully:

```tsx
const config = {
  onSuccess: (message: string) => {
    console.log("Operation successful:", message);
    // Show success notification
    toast.success(message);
  },
};
```

### Error Handler

Called when operations encounter errors:

```tsx
const config = {
  onError: (error: Error) => {
    console.error("Operation failed:", error);
    // Show error notification
    toast.error(error.message);
    // Send to error tracking service
    errorTracker.captureException(error);
  },
};
```

### Complete Example

```tsx
import { ZeusWidget, BitcoinNetwork, SolanaNetwork } from "zeus-widget";
import { useDeriveWalletConnector, Connectors } from "zeus-widget/bitcoin";
import { toast } from "react-hot-toast";

function App() {
  const deriveWallet = useDeriveWalletConnector(BitcoinNetwork.Regtest);

  const config = {
    bitcoinNetwork: BitcoinNetwork.Regtest,
    solanaNetwork: SolanaNetwork.Devnet,
    bitcoinWallets: [
      deriveWallet,
      new Connectors.PhantomConnector(),
      new Connectors.UniSatConnector(),
    ],
    onSuccess: (message: string) => {
      toast.success(message);
    },
    onError: (error: Error) => {
      toast.error(error.message);
      console.error("Zeus Widget error:", error);
    },
  };

  return (
    <ZeusWidget.Popover config={config}>
      <ZeusWidget.Popover.Trigger asChild>
        <button>Open Zeus Widget</button>
      </ZeusWidget.Popover.Trigger>
      <ZeusWidget.Popover.Content side="top" />
    </ZeusWidget.Popover>
  );
}
```

## Style Configuration

### CSS Isolation with ZeusShadow

For non-Tailwind projects, use `ZeusShadow` to prevent CSS conflicts:

```tsx
import { ZeusShadow, ZeusWidget } from "zeus-widget";

// Isolated widget
<ZeusShadow>
  <ZeusWidget config={config} />
</ZeusShadow>

// Isolated modal content
<ZeusWidget.Dialog config={config}>
  <ZeusWidget.Dialog.Trigger asChild>
    <button>Open Widget</button>
  </ZeusWidget.Dialog.Trigger>
  <ZeusShadow>
    <ZeusWidget.Dialog.Content />
  </ZeusShadow>
</ZeusWidget.Dialog>
```

### CSS Framework Compatibility

| Framework        | Integration Method | Example                                   |
| ---------------- | ------------------ | ----------------------------------------- |
| **Tailwind CSS** | Direct import      | `import "zeus-widget/assets/style.css"`   |
| **Bootstrap**    | Use ZeusShadow     | `<ZeusShadow><ZeusWidget /></ZeusShadow>` |
| **Material-UI**  | Use ZeusShadow     | `<ZeusShadow><ZeusWidget /></ZeusShadow>` |
| **Ant Design**   | Use ZeusShadow     | `<ZeusShadow><ZeusWidget /></ZeusShadow>` |

## Integration Examples

### Popover Integration (Recommended)

```tsx
<ZeusWidget.Popover config={config}>
  <ZeusWidget.Popover.Trigger asChild>
    <button className="btn btn-primary">Open Zeus Widget</button>
  </ZeusWidget.Popover.Trigger>
  <ZeusWidget.Popover.Content side="top" align="center" sideOffset={10} />
</ZeusWidget.Popover>
```

### Modal Integration

```tsx
<ZeusWidget.Dialog config={config}>
  <ZeusWidget.Dialog.Trigger asChild>
    <button className="btn btn-secondary">Open Widget Modal</button>
  </ZeusWidget.Dialog.Trigger>
  <ZeusWidget.Dialog.Content />
</ZeusWidget.Dialog>
```

### Embedded Integration

```tsx
<div className="widget-container">
  <ZeusWidget config={config} className="custom-widget-styles" />
</div>
```

## Development vs Production

### Development Configuration

```tsx
// Recommended for development
const devConfig = {
  bitcoinNetwork: BitcoinNetwork.Regtest,
  solanaNetwork: SolanaNetwork.Devnet,
  bitcoinWallets: [
    useDeriveWalletConnector(BitcoinNetwork.Regtest), // No external wallets needed
  ],
  onSuccess: (message) => console.log("✅", message),
  onError: (error) => console.error("❌", error),
};
```

### Production Configuration

```tsx
// Production configuration
const prodConfig = {
  bitcoinNetwork: BitcoinNetwork.Mainnet,
  solanaNetwork: SolanaNetwork.Mainnet,
  bitcoinWallets: [
    new Connectors.PhantomConnector(),
    new Connectors.UniSatConnector(),
    new Connectors.OKXConnector(),
    new Connectors.XverseConnector(),
  ],
  onSuccess: (message) => {
    analytics.track("zeus_widget_success", { message });
    toast.success(message);
  },
  onError: (error) => {
    errorReporting.captureException(error);
    toast.error("Transaction failed. Please try again.");
  },
};
```

### Environment-Based Configuration

```tsx
const getConfig = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    bitcoinNetwork: isProduction
      ? BitcoinNetwork.Mainnet
      : BitcoinNetwork.Regtest,
    solanaNetwork: isProduction ? SolanaNetwork.Mainnet : SolanaNetwork.Devnet,
    bitcoinWallets: isProduction ? productionWallets : developmentWallets,
    onSuccess: isProduction ? productionSuccessHandler : devSuccessHandler,
    onError: isProduction ? productionErrorHandler : devErrorHandler,
  };
};
```

## Troubleshooting

### Common Configuration Issues

**Network Mismatch**

```tsx
// ❌ Invalid - unsupported network combination
const invalidConfig = {
  bitcoinNetwork: BitcoinNetwork.Mainnet,
  solanaNetwork: SolanaNetwork.Devnet, // Mismatch!
};

// ✅ Valid network combinations
const validConfigs = [
  {
    bitcoinNetwork: BitcoinNetwork.Mainnet,
    solanaNetwork: SolanaNetwork.Mainnet,
  },
  {
    bitcoinNetwork: BitcoinNetwork.Testnet,
    solanaNetwork: SolanaNetwork.Devnet,
  },
  {
    bitcoinNetwork: BitcoinNetwork.Regtest,
    solanaNetwork: SolanaNetwork.Devnet,
  },
];
```

**Missing Wallet Providers**

```tsx
// ❌ Error: Widget used outside wallet providers
function App() {
  return <ZeusWidget config={config} />; // Will fail!
}

// ✅ Correct: Widget used within wallet providers
function App() {
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <ZeusWidget config={config} />
      </WalletProvider>
    </ConnectionProvider>
  );
}
```

**Styling Conflicts**

```tsx
// ❌ May cause style conflicts in non-Tailwind projects
<ZeusWidget config={config} />

// ✅ Use ZeusShadow for style isolation
<ZeusShadow>
  <ZeusWidget config={config} />
</ZeusShadow>
```

### Configuration Validation

Add runtime validation for your configuration:

```tsx
function validateConfig(config: ZeusWidgetConfig) {
  const validCombinations = [
    { bitcoin: BitcoinNetwork.Mainnet, solana: SolanaNetwork.Mainnet },
    { bitcoin: BitcoinNetwork.Testnet, solana: SolanaNetwork.Devnet },
    { bitcoin: BitcoinNetwork.Regtest, solana: SolanaNetwork.Devnet },
  ];

  const isValidCombination = validCombinations.some(
    (combo) =>
      combo.bitcoin === config.bitcoinNetwork &&
      combo.solana === config.solanaNetwork,
  );

  if (!isValidCombination) {
    throw new Error(
      `Invalid network combination: Bitcoin ${config.bitcoinNetwork} + Solana ${config.solanaNetwork}`,
    );
  }

  return config;
}

// Usage
const config = validateConfig({
  bitcoinNetwork: BitcoinNetwork.Regtest,
  solanaNetwork: SolanaNetwork.Devnet,
});
```

## Next Steps

- See the [main README](../README.md) for integration examples
- Check the [API Reference](../README.md#api-reference) for component props
- Visit the [demo application](../apps/zeus-widget-demo) for live examples
