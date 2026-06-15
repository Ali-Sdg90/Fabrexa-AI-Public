# Fabrexa AI

A sophisticated Telegram bot powered by local Ollama models with advanced memory management, personality system, and streaming responses.

## Features

- **Local AI Models**: Fully self-hosted using Ollama - no cloud dependencies or API costs
- **Personality System**: Multiple configurable AI personalities with persistent system prompts
- **Smart Memory Management**: Intelligent conversation history with summarization and analysis
- **Real-time Streaming**: Live message updates as AI generates responses
- **Access Control**: Private mode (owner-only) or public deployment
- **Customizable Parameters**: Fine-tune model behavior (temperature, context window, token limits)
- **Automated Memory Optimization**: Scheduled background processing for memory efficiency

## Quick Start

### Prerequisites

- **Node.js** 18.0.0 or higher
- **Ollama** installed and running locally
- A Telegram bot token from [BotFather](https://t.me/botfather)

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/Fabrexa-AI-Public.git
    cd Fabrexa-AI-Public
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Verify setup**

    ```bash
    npm run check
    ```

4. **Configure environment**

    ```bash
    cp .env.example .env
    nano .env  # or your preferred editor
    ```

5. **Start the bot**
    ```bash
    npm start
    ```

## Configuration

See [.env.example](./.env.example) for all available options. Key settings:

- `TELEGRAM_BOT_TOKEN`: Your Telegram bot token
- `OWNER_ID`: Your Telegram user ID (required for private mode)
- `OLLAMA_MODEL`: Model name (default: gemma3:12b)
- `BOT_PRIVATE`: true for owner-only, false for public

## Project Structure

```
src/
├── ai/              # Ollama client and configuration
├── bot/             # Telegram bot handlers and middleware
├── config/          # Environment and runtime configuration
├── memory/          # Conversation memory and analysis
└── personalities/   # Personality definitions and management

chat_memory/        # Persistent user conversations
personalities/      # Custom personality definitions (.txt files)
```

## Documentation

Complete documentation is available in the [`docs/`](./docs/) folder:

- **[Installation Guide](./docs/INSTALLATION.md)** - Step-by-step setup instructions
- **[Configuration Guide](./docs/CONFIGURATION.md)** - All environment variables and settings
- **[Features & Usage](./docs/FEATURES.md)** - Bot capabilities and how to use them
- **[Development Guide](./docs/DEVELOPMENT.md)** - Development workflow and contributing
- **[Architecture](./docs/ARCHITECTURE.md)** - System design and technical reference
- **[Troubleshooting](./docs/TROUBLESHOOTING.md)** - Solutions for common issues

**New to the project?** Start with [Quick Start Guide](./QUICK_START.md) (5 minutes) or [Complete Documentation Index](./docs/DOCUMENTATION.md) for all guides.

## Quick Links

| Purpose             | File                                                 |
| ------------------- | ---------------------------------------------------- |
| 🚀 Get running fast | [QUICK_START.md](./QUICK_START.md)                   |
| 📖 Setup details    | [docs/INSTALLATION.md](./docs/INSTALLATION.md)       |
| ⚙️ All settings     | [docs/CONFIGURATION.md](./docs/CONFIGURATION.md)     |
| ✨ Features         | [docs/FEATURES.md](./docs/FEATURES.md)               |
| 🧠 Architecture     | [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)       |
| 🐛 Troubleshooting  | [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) |
| 🤝 Contributing     | [CONTRIBUTING.md](./CONTRIBUTING.md)                 |
| 📚 All docs         | [docs/](./docs/)                                     |

## Technology Stack

- **Runtime**: Node.js
- **Telegram**: Telegraf (v4.16.0)
- **AI**: Ollama (local models)
- **Task Scheduling**: node-cron
- **HTTP Client**: axios
- **Linting**: ESLint

## Available Commands

| Command                  | Purpose                        |
| ------------------------ | ------------------------------ |
| `npm start`              | Production mode                |
| `npm run dev`            | Development mode with env file |
| `npm run check`          | Verify environment setup       |
| `npm run lint`           | Code quality check             |
| `npm run memory-process` | Manual memory processing       |

## Performance Considerations

- Local model execution means slower responses compared to cloud APIs
- Adjust `REQUEST_TIMEOUT` based on your hardware (default: 120s)
- Memory processing happens automatically via scheduled tasks
- Use `OLLAMA_NUM_CTX` to balance context window vs memory usage

## License

MIT - See [LICENSE](./LICENSE) for details

## Author

Ali Sadeghi

---

**For detailed setup and configuration, refer to the [Installation Guide](./INSTALLATION.md).**
