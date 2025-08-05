# Zeus Widget

<div align="center">
  <img src="./apps/zeus-widget-demo/public/branding/logo-primary.svg" alt="Zeus Widget" width="300">
  
  <p>Instantly add tokenized Bitcoin flows to any website or app—no code, no friction.</p>

[![npm version](https://badge.fury.io/js/zeus-widget.svg)](https://badge.fury.io/js/zeus-widget)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/github/actions/workflow/status/ZeusNetworkHQ/zeus-widget/ci.yml?branch=main)](https://github.com/ZeusNetworkHQ/zeus-widget/actions)
[![Downloads](https://img.shields.io/npm/dm/zeus-widget)](https://www.npmjs.com/package/zeus-widget)

</div>

The Zeus Widget is a JavaScript/React component library that provides a fully featured and customizable Bitcoin tokenization experience for web and mobile applications. The widget enables users to seamlessly deposit Bitcoin to receive zBTC (tokenized Bitcoin) and withdraw zBTC back to Bitcoin, all through an intuitive, embeddable interface.

The widget can be embedded directly into your organization's web or mobile applications for a seamless user experience, or used in a popup/modal format for minimal integration effort.

See the [Usage Guide](#usage-guide) for more information on how to get started using the Zeus Widget.

## Table of Contents

- [Key Features](#key-features)
- [Sample Applications](#sample-applications)
- [Usage Guide](#usage-guide)
  - [Prerequisites](#prerequisites)
  - [NPM Installation](#npm-installation)
  - [React Integration](#react-integration)
  - [Integration Modes](#integration-modes)
  - [Derive Wallet Integration](#derive-wallet-integration)
  - [Troubleshooting](#troubleshooting)
- [API Reference](#api-reference)
- [Configuration](#configuration)
- [CSS Framework Compatibility](#css-framework-compatibility)
- [Development](#development)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## Key Features

- **🔗 Multiple Integration Modes**: Embed as a popup, modal, or integrated component
- **🚀 Derive Wallet**: Develop without Bitcoin extensions - uses your Solana wallet
- **🪙 Bitcoin Wallet Support**: Compatible with popular Bitcoin wallets (UniSat, OKX, Phantom, Xverse)
- **⚡ Solana Integration**: Built on Solana for fast, low-cost transactions
- **🛡️ Type Safe**: Full TypeScript support
- **📱 Mobile Ready**: Responsive design for all devices
- **🎯 Zero Config**: Works out of the box with sensible defaults

## Sample Applications

Complete sample applications demonstrate usage of the Zeus Widget in embedded scenarios:

- [Next.js Demo App](./apps/zeus-widget-demo) - Complete implementation with all features
- [Live Demo](https://playground.zeusstack.dev) - Interactive playground

## Usage Guide

### Prerequisites

Before integrating Zeus Widget, ensure your application meets these requirements:

- **React 18+** - Zeus Widget is built for React applications
- **Solana Wallet Providers** - Required for Solana blockchain integration

Zeus Widget uses your application's Solana wallet context and cannot function without proper wallet provider setup.

### Integration Approaches

There are two primary ways to use the Zeus Widget:

- **NPM Module** - Install and bundle the widget into your application (recommended)
- **Local Development** - Clone and build the widget locally for development

### NPM Installation

Using our npm module is the recommended way to integrate Zeus Widget into your application. This approach gives you:

- Full TypeScript support and type safety
- Tree-shaking and optimized bundle sizes
- Integration with your existing build process
- Access to all widget features and customization options

#### Install Zeus Widget

```bash
# npm
npm install zeus-widget

# yarn
yarn add zeus-widget

# pnpm
pnpm add zeus-widget
```

### React Integration

Zeus Widget is built as a React component library with full TypeScript support. **Important: The widget requires Solana wallet providers to be set up in your application.**

#### Step 1: Set Up Solana Wallet Providers

First, wrap your application with the required Solana wallet providers:

```tsx
import React, { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

import "@solana/wallet-adapter-react-ui/styles.css";

function App() {
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    [],
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        {/* Your app components go here */}
        <YourAppContent />
      </WalletProvider>
    </ConnectionProvider>
  );
}
```

#### Step 2: Use Zeus Widget

Now you can use the Zeus Widget anywhere within your wallet provider tree:

```tsx
import { ZeusWidget, BitcoinNetwork, SolanaNetwork } from "zeus-widget";
import "zeus-widget/assets/style.css";

function YourAppContent() {
  return (
    <ZeusWidget.Popover
      config={{
        bitcoinNetwork: BitcoinNetwork.Mainnet,
        solanaNetwork: SolanaNetwork.Mainnet,
        onSuccess: (message) => console.log("Success:", message),
        onError: (error) => console.error("Error:", error),
      }}
    >
      <ZeusWidget.Popover.Trigger asChild>
        <button>Open Zeus Widget</button>
      </ZeusWidget.Popover.Trigger>
      <ZeusWidget.Popover.Content side="top" />
    </ZeusWidget.Popover>
  );
}
```

> ⚠️ **Important**: Zeus Widget must be used within Solana wallet providers. The widget uses your application's wallet provider context to connect to Solana wallets.

> 💡 **New to Zeus Widget?** Start with our [Derive Wallet Integration](#derive-wallet-integration) for the easiest setup - no Bitcoin wallet extensions required!

### Integration Modes

**1. Popover Widget (Recommended)**

```tsx
<ZeusWidget.Popover config={config}>
  <ZeusWidget.Popover.Trigger asChild>
    <button>Open Widget</button>
  </ZeusWidget.Popover.Trigger>
  <ZeusWidget.Popover.Content side="top" />
</ZeusWidget.Popover>
```

**2. Modal Widget**

```tsx
<ZeusWidget.Dialog config={config}>
  <ZeusWidget.Dialog.Trigger asChild>
    <button>Open Widget</button>
  </ZeusWidget.Dialog.Trigger>
  <ZeusWidget.Dialog.Content />
</ZeusWidget.Dialog>
```

**3. Integrated Widget**

```tsx
<ZeusWidget config={config} />
```

### Derive Wallet Integration

**The easiest way to get started!** Use the Derive Wallet to test Zeus Widget without installing Bitcoin wallet extensions. It creates a Bitcoin wallet derived from your connected Solana wallet.

> ⚠️ **Prerequisites**: Ensure you have [set up Solana wallet providers](#react-integration) in your application before using any Zeus Widget features.

#### Quick Start with Derive Wallet

```tsx
import { ZeusWidget, BitcoinNetwork, SolanaNetwork } from "zeus-widget";
import { useDeriveWalletConnector } from "zeus-widget/bitcoin";
import "zeus-widget/assets/style.css";

function YourAppContent() {
  const deriveWallet = useDeriveWalletConnector(BitcoinNetwork.Regtest);

  return (
    <ZeusWidget.Popover
      config={{
        bitcoinNetwork: BitcoinNetwork.Regtest,
        solanaNetwork: SolanaNetwork.Devnet,
        bitcoinWallets: [deriveWallet], // No Bitcoin extensions needed!
      }}
    >
      <ZeusWidget.Popover.Trigger asChild>
        <button>Test Zeus Widget</button>
      </ZeusWidget.Popover.Trigger>
      <ZeusWidget.Popover.Content side="top" />
    </ZeusWidget.Popover>
  );
}
```

#### Why Use Derive Wallet?

- ✅ **No Bitcoin wallet installation required**
- ✅ **Perfect for development and testing**
- ✅ **Uses your existing Solana wallet**
- ✅ **Simplified setup and onboarding**

### Troubleshooting

#### Common Setup Issues

**Error: "Cannot read properties of undefined (reading 'publicKey')"**

- Ensure Zeus Widget is used within Solana wallet providers
- Verify that `@solana/wallet-adapter-react` is properly installed and configured

**Error: "Module not found: @solana/wallet-adapter-react"**

- Install the required peer dependencies listed in the [NPM Installation](#npm-installation) section

**Styling Issues**

- Import the required CSS files: `zeus-widget/assets/style.css` and `@solana/wallet-adapter-react-ui/styles.css`
- For non-Tailwind projects, wrap components with `ZeusShadow`

**Network Mismatch**

- Ensure your Solana wallet provider network matches the `solanaNetwork` config in Zeus Widget

## API Reference

### ZeusWidget

The main Zeus Widget component for direct embedding in your React application.

```tsx
import { ZeusWidget, BitcoinNetwork, SolanaNetwork } from "zeus-widget";
import "zeus-widget/assets/style.css";

function App() {
  return (
    <ZeusWidget
      config={{
        bitcoinNetwork: BitcoinNetwork.Mainnet,
        solanaNetwork: SolanaNetwork.Mainnet,
        onSuccess: (message) => console.log("Success:", message),
        onError: (error) => console.error("Error:", error),
      }}
    />
  );
}
```

### ZeusWidget.Popover

Renders the widget as a popover component. Recommended for most use cases.

```tsx
<ZeusWidget.Popover config={config}>
  <ZeusWidget.Popover.Trigger asChild>
    <button>Open Widget</button>
  </ZeusWidget.Popover.Trigger>
  <ZeusWidget.Popover.Content side="top" />
</ZeusWidget.Popover>
```

### ZeusWidget.Dialog

Renders the widget as a modal dialog.

```tsx
<ZeusWidget.Dialog config={config}>
  <ZeusWidget.Dialog.Trigger asChild>
    <button>Open Widget</button>
  </ZeusWidget.Dialog.Trigger>
  <ZeusWidget.Dialog.Content />
</ZeusWidget.Dialog>
```

### ZeusShadow

Provides style isolation for non-Tailwind projects to prevent CSS conflicts.

```tsx
import { ZeusShadow, ZeusWidget } from "zeus-widget";

<ZeusShadow>
  <ZeusWidget config={config} />
</ZeusShadow>

// or

<ZeusWidget.Dialog config={config}>
  <ZeusWidget.Dialog.Trigger asChild>
    <button>Open Widget</button>
  </ZeusWidget.Dialog.Trigger>
  <ZeusShadow>
    <ZeusWidget.Dialog.Content />
  </ZeusShadow>
</ZeusWidget.Dialog>
```

## Configuration

### Basic Config Options

All embedded widgets should set these basic options: `bitcoinNetwork`, `solanaNetwork`.

#### bitcoinNetwork

The Bitcoin network to use for transactions. Can be:

- `BitcoinNetwork.Mainnet` - Bitcoin mainnet
- `BitcoinNetwork.Regtest` - Bitcoin regtest (recommended for development)
- `BitcoinNetwork.Testnet` - Bitcoin testnet

#### solanaNetwork

The Solana network to use for transactions. Can be:

- `SolanaNetwork.Mainnet` - Solana mainnet
- `SolanaNetwork.Devnet` - Solana devnet (recommended for development)
- `SolanaNetwork.Testnet` - Solana testnet

#### bitcoinWallets

Array of Bitcoin wallet connectors to support.

```tsx
import { useDeriveWalletConnector, UnisatConnector } from "zeus-widget/bitcoin";

const deriveWallet = useDeriveWalletConnector(BitcoinNetwork.Regtest);
const unisatWallet = new UnisatConnector();

const config = {
  bitcoinNetwork: BitcoinNetwork.Regtest,
  solanaNetwork: SolanaNetwork.Devnet,
  bitcoinWallets: [deriveWallet, unisatWallet],
};
```

#### onSuccess

Callback function called when a transaction is successful.

```tsx
const config = {
  onSuccess: (message: string) => {
    console.log("Transaction successful:", message);
  },
};
```

#### onError

Callback function called when an error occurs.

```tsx
const config = {
  onError: (error: Error) => {
    console.error("Transaction failed:", error.message);
  },
};
```

#### ZeusShadow (Style Isolation)

For projects not using Tailwind CSS, wrap the widget with `ZeusShadow` to prevent style conflicts:

```tsx
import { ZeusShadow, ZeusWidget } from "zeus-widget";

<ZeusShadow>
  <ZeusWidget config={config} />
</ZeusShadow>;
```

**Why use ZeusShadow?**

- **Style Isolation**: Prevents Zeus Widget styles from affecting your app
- **CSS Conflicts**: Avoids conflicts with your existing CSS frameworks
- **Clean Integration**: Ensures the widget looks consistent regardless of your project's styling

## CSS Framework Compatibility

Zeus Widget works seamlessly with popular CSS frameworks:

| Framework             | Support            | Integration Method |
| --------------------- | ------------------ | ------------------ |
| **Tailwind CSS**      | ✅ Native          | Direct import      |
| **Bootstrap**         | ✅ With ZeusShadow | Style isolation    |
| **Material-UI**       | ✅ With ZeusShadow | Style isolation    |
| **Styled-Components** | ✅ With ZeusShadow | Style isolation    |
| **Ant Design**        | ✅ With ZeusShadow | Style isolation    |
| **Others**            | ✅ With ZeusShadow | Style isolation    |

## Development

### Prerequisites

- Node.js 18+
- pnpm (recommended package manager)

### Building the Widget

We use pnpm as our node package manager. To install pnpm, check out their [install documentation](https://pnpm.io/installation).

1. Clone this repo and navigate to the new `zeus-widget` folder.

```bash
git clone https://github.com/ZeusNetworkHQ/zeus-widget.git
cd zeus-widget
```

2. Install our Node dependencies.

```bash
pnpm install
```

3. Create a configuration file in your application with your desired configuration:

```tsx
import { BitcoinNetwork, SolanaNetwork } from "zeus-widget";

const config = {
  bitcoinNetwork: BitcoinNetwork.Regtest,
  solanaNetwork: SolanaNetwork.Devnet,
  // Add other configuration options
};
```

4. Start the development server and launch a browser window with the widget running.

```bash
pnpm dev
```

### Build and Test Commands

| Command         | Description                                |
| --------------- | ------------------------------------------ |
| `pnpm dev`      | Start development servers for all packages |
| `pnpm build`    | Build all packages for production          |
| `pnpm lint`     | Run ESLint and type checking               |
| `pnpm test`     | Run unit tests across all packages         |
| `pnpm demo dev` | Start the demo application                 |

### Project Structure

```
zeus-widget/
├── apps/
│   └── zeus-widget-demo/    # Demo Next.js application
├── packages/
│   ├── zeus-widget/         # Main widget library
│   ├── core/                # Core functionalities
│   └── bitcoin-wallet/      # Bitcoin wallet utilities
├── package.json             # Root package configuration
├── turbo.json               # Turborepo configuration
└── pnpm-workspace.yaml      # PNPM workspace configuration
```

## Documentation

- [Widget API Reference](./packages/zeus-widget/README.md)
- [Configuration Options](./docs/configuration.md)
- [Bitcoin Wallet Integration](./packages/bitcoin-wallet/README.md)

## Contributing

We're happy to accept contributions and PRs! Please see the [contribution guide](./CONTRIBUTING.md) to understand how to structure a contribution.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'feat: add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Support

- 📖 [Documentation](https://docs.zeusnetwork.xyz)
- 💬 [Discord](https://discord.gg/zeusnetwork)
- 🐦 [X](https://twitter.com/ZeusNetworkHQ)

## Built With

- [React](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vitejs.dev/) - Build tool
- [Pnpm](https://pnpm.io/) - Package manager
- [Turborepo](https://turbo.build/) - Monorepo build system
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/) - Solana integration
- [Radix UI](https://www.radix-ui.com/) - UI primitives

---

<div align="center">
  <p>Made with ❤️ by the Zeus Network team</p>
  <p>
    <a href="https://zeusnetwork.xyz">Website</a> •
    <a href="https://twitter.com/ZeusNetworkHQ">X</a> •
    <a href="https://discord.gg/zeusnetwork">Discord</a>
  </p>
</div>
