# Quick Start Guide

Get Fabrexa AI running in 5 minutes.

## Prerequisites

- **Node.js 18+** - https://nodejs.org/
- **Ollama** - https://ollama.ai
- **Telegram Bot Token** - https://t.me/botfather

## 1-Minute Setup

```bash
# Clone & install
git clone https://github.com/yourusername/Fabrexa-AI-Public.git
cd Fabrexa-AI-Public
npm install

# Configure
cp .env.example .env
# Edit .env with your token and ID

# Start Ollama (new terminal/window)
ollama serve

# Start bot
npm start
```

## Essential Configuration

Edit `.env`:

```env
TELEGRAM_BOT_TOKEN=your_token_from_botfather
OWNER_ID=your_numeric_telegram_id
OLLAMA_MODEL=gemma3:12b
BOT_PRIVATE=true
```

## Get Required Values

### Telegram Bot Token

1. Chat [@BotFather](https://t.me/botfather)
2. Send `/newbot`
3. Follow prompts
4. Copy token to `.env`

### Your Telegram ID

1. Chat [@userinfobot](https://t.me/userinfobot)
2. It replies with your numeric ID
3. Copy to `OWNER_ID` in `.env`

## First Run Checklist

- [ ] Ollama installed and running (`ollama serve`)
- [ ] `.env` file created with token and ID
- [ ] Model downloaded: `ollama pull gemma3:12b`
- [ ] Bot started: `npm start`
- [ ] Message sent to bot on Telegram
- [ ] Response received

## Verify Everything Works

```bash
npm run check
```

This verifies:

- ✓ Environment variables
- ✓ Ollama connection
- ✓ Model available
- ✓ Telegram token valid

## Common Errors & Fixes

| Error                                  | Fix                                                  |
| -------------------------------------- | ---------------------------------------------------- |
| `TELEGRAM_BOT_TOKEN is not set`        | Copy token to `.env` exactly                         |
| `connect ECONNREFUSED 127.0.0.1:11434` | Start Ollama: `ollama serve`                         |
| `model not found`                      | Run: `ollama pull gemma3:12b`                        |
| `OWNER_ID must be numeric`             | Get ID from [@userinfobot](https://t.me/userinfobot) |

## Available Commands

```bash
npm start              # Run bot
npm run dev           # Development mode (debug logging)
npm run check         # Verify setup
npm run lint          # Code quality
npm run memory-process # Process memory manually
```

## Next Steps

1. **Read Full Docs**
    - [README.md](./README.md) - Project overview
    - [CONFIGURATION.md](./docs/CONFIGURATION.md) - All settings
    - [FEATURES.md](./docs/FEATURES.md) - Bot capabilities

2. **Customize**
    - Create personality: `personalities/MyBot.txt`
    - Adjust settings in `.env`
    - Enable memory for personalities

3. **Develop**
    - See [DEVELOPMENT.md](./docs/DEVELOPMENT.md)
    - Check [ARCHITECTURE.md](./docs/ARCHITECTURE.md)

## Support

- 🔧 **Setup Issues?** → [INSTALLATION.md](./docs/INSTALLATION.md)
- ⚙️ **Configuration?** → [CONFIGURATION.md](./docs/CONFIGURATION.md)
- 🐛 **Problems?** → [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)
- 💻 **Development?** → [DEVELOPMENT.md](./docs/DEVELOPMENT.md)

---

**Stuck?** Check [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) for detailed solutions.
