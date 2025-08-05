# @zeus-widget/zeus-widget

The main Zeus Widget package containing React components for Bitcoin tokenization. This package provides the primary widget components that developers use to integrate Zeus functionality into their applications.

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

| Command                 | Description                              |
| ----------------------- | ---------------------------------------- |
| `pnpm dev`              | Start development server with hot reload |
| `pnpm widget build`     | Build the widget package                 |
| `pnpm widget build:dev` | Build with development configuration     |
| `pnpm widget lint`      | Run ESLint                               |

### Package Structure

```
src/
├── components/         # Reusable UI components
├── contexts/           # React contexts for state management
├── features/           # Feature-specific components
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── assets/             # Static assets
├── main.ts             # Main entry point
└── global.css          # Global styles
```

### Key Components

- **ZeusWidget**: Main widget component
- **ZeusWidget.Popover**: Popover variant
- **ZeusWidget.Dialog**: Modal variant
- **ZeusShadow**: Style isolation wrapper
- **ZeusButton**: Branded button component

### Contributing

1. Make your changes in the `src/` directory
2. Ensure all tests pass: `pnpm test`
3. Verify build works: `pnpm widget build`
4. Submit a pull request

For detailed usage documentation, see the [main README](../../README.md).
