# @zeus-widget/core

Core functionality package for Zeus Widget. This package contains the business logic, API clients, data models, and configuration for Bitcoin tokenization operations on Zeus Network.

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

| Command               | Description                              |
| --------------------- | ---------------------------------------- |
| `pnpm dev`            | Start development server with hot reload |
| `pnpm core build`     | Build the core package                   |
| `pnpm core build:dev` | Build with development configuration     |
| `pnpm core lint`      | Run ESLint                               |

### Package Structure

```
src/
├── clients/            # API clients for external services
├── config/             # Configuration classes and helpers
├── constants/          # Application constants
├── errors/             # Custom error classes
├── layers/             # Protocol layer abstractions
├── lib/                # Utility libraries
├── models/             # Data models and business logic
├── programs/           # Solana program interactions
├── services/           # Business services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── main.ts             # Main entry point
```

### Key Components

#### Configuration

- **CoreConfig**: Main configuration class for networks and connections

#### API Clients

- **Ares**: Zeus Network API client
- **Hermes**: Transaction indexing client
- **Binance**: Price feed client
- **Unisat**: Bitcoin indexing client
- **Aegle**: Testnet utilities client

#### Models

- **Interaction**: Transaction interaction model
- **Utxo**: Bitcoin UTXO management
- **EntityDerivedReserveAddress**: Address derivation
- **ReserveSetting**: Reserve configuration
- **TokenAccount**: Solana token account management

#### Services

- **Deposit**: Bitcoin deposit operations
- **Withdraw**: Bitcoin withdrawal operations

#### Layer

- **ZeusLayer**: Controller for operations

### Architecture

The core package follows a layered architecture:

1. **Configuration Layer**: Network and connection setup
2. **Client Layer**: External API integrations
3. **Model Layer**: Business logic and data models
4. **Program Layer**: Blockchain program interactions
5. **Service Layer**: High-level business operations

### Contributing

1. Make your changes in the appropriate `src/` subdirectory
2. Follow the existing patterns for clients, models, and programs
3. Add comprehensive tests for new functionality
4. Ensure all tests pass: `pnpm test`
5. Verify build works: `pnpm core build`
6. Submit a pull request

### Adding New Clients

1. Create a new client in `src/clients/`
2. Define schemas using Zod in `*.schema.ts`
3. Implement the client class extending common patterns
4. Add comprehensive error handling
5. Export the client in `src/clients/index.ts`

For detailed usage documentation, see the [main README](../../README.md).
