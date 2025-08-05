# @zeus-widget/bitcoin-wallet

Bitcoin wallet provider and connector utilities for Zeus Widget. This package handles Bitcoin wallet integrations, providing connectors for popular Bitcoin wallets and a derive wallet functionality.

## Development Setup

### Prerequisites

- Node.js 18+
- pnpm (workspace package manager)

### Getting Started

1. Install dependencies from the workspace root:

```bash
pnpm install
```

2. Start development server:

```bash
pnpm dev
```

3. Run tests:

```bash
pnpm test
```

### Development Commands

| Command                         | Description                              |
| ------------------------------- | ---------------------------------------- |
| `pnpm dev`                      | Start development server with hot reload |
| `pnpm bitcoin-wallet build`     | Build the bitcoin-wallet package         |
| `pnpm bitcoin-wallet build:dev` | Build with development configuration     |
| `pnpm bitcoin-wallet lint`      | Run ESLint                               |

### Package Structure

```
src/
├── components/          # React components for wallet functionality
├── connectors/         # Wallet connector implementations
├── contexts/           # React contexts for wallet state
├── hooks/              # Custom hooks for wallet operations
├── types/              # TypeScript type definitions
├── assets/             # Wallet icons and assets
└── main.ts             # Main entry point
```

### Supported Wallets

- **UniSat**: Desktop and mobile Bitcoin wallet
- **OKX**: Multi-chain wallet with Bitcoin support
- **Phantom**: Multi-chain wallet with Bitcoin support
- **Xverse**: Bitcoin and Stacks wallet
- **Muses**: Bitcoin-focused wallet
- **Derive Wallet**: Development wallet derived from Solana wallet

### Key Components

- **BitcoinWalletProvider**: Main provider for wallet context
- **BitcoinWalletSelector**: UI component for wallet selection
- **Connectors**: Individual wallet connector implementations
- **useDeriveWalletConnector**: Hook for derive wallet functionality

### Adding New Wallet Connectors

1. Create a new connector in `src/connectors/`
2. Extend the `BaseConnector` class
3. Implement required methods (`connect`, `disconnect`, `signTransaction`, etc.)
4. Add wallet assets (like icons) to `src/assets/`
5. Export the connector in `src/connectors/index.ts`

### Contributing

1. Make your changes in the `src/` directory
2. Add tests for new wallet connectors
3. Ensure all tests pass: `pnpm test`
4. Verify build works: `pnpm bitcoin-wallet build`
5. Submit a pull request

For detailed usage documentation, see the [main README](../../README.md).
