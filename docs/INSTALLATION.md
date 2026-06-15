# Installation Guide

Complete setup instructions for Fabrexa AI Telegram bot.

## System Requirements

- **Operating System**: Linux, macOS, or Windows with WSL2
- **Node.js**: Version 18.0.0 or higher
- **Ollama**: Latest version (https://ollama.ai)
- **RAM**: 8GB minimum (16GB+ recommended for larger models)
- **Disk Space**: 10GB+ for model storage

## Step-by-Step Installation

### 1. Install Ollama

**Windows/macOS/Linux**:
- Download from [ollama.ai](https://ollama.ai)
- Install following official instructions
- Verify installation:
  ```bash
  ollama --version
  ```

### 2. Pull a Model

```bash
ollama pull gemma3:12b
```

Popular model options:
- `gemma3:12b` - Balanced performance and quality (recommended)
- `llama3.1:8b` - Lightweight, fast
- `llama3.1:13b` - Better quality, more resources
- `mistral:7b` - Alternative lightweight option

Check available models: https://ollama.ai/library

### 3. Start Ollama Service

**Linux/macOS**:
```bash
ollama serve
```

**Windows**:
- Ollama runs as a background service (starts automatically)
- Verify it's running: `curl http://localhost:11434`

### 4. Get Telegram Bot Token

1. Open [Telegram BotFather](https://t.me/botfather)
2. Send `/newbot`
3. Follow prompts to create new bot
4. Save your token (format: `123456789:ABCdefGHIjklmnoPQRstuvWXYZ...`)

### 5. Get Your Telegram User ID

1. Open [Telegram Raw Data Bot](https://t.me/userinfobot)
2. Send any message
3. Bot will reply with your numeric ID (e.g., `123456789`)

### 6. Clone and Setup Repository

```bash
git clone https://github.com/yourusername/Fabrexa-AI-Public.git
cd Fabrexa-AI-Public
node --version  # Verify Node.js 18+
```

### 7. Install Dependencies

```bash
npm install
```

### 8. Verify Setup

```bash
npm run check
```

This will validate:
- Environment variables are readable
- Ollama server is accessible
- Model is available
- Telegram token is valid

### 9. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your values:
```
TELEGRAM_BOT_TOKEN=your_actual_token_here
OWNER_ID=your_telegram_id_here
OLLAMA_MODEL=gemma3:12b
BOT_PRIVATE=true
```

See [CONFIGURATION.md](./CONFIGURATION.md) for all options.

### 10. Start Bot

**Production Mode**:
```bash
npm start
```

**Development Mode** (hot reload with env file):
```bash
npm run dev
```

Monitor output for initialization messages:
```
✓ Ollama model loaded
✓ Bot started successfully
```

## Troubleshooting

### Bot Won't Start

**Error**: `TELEGRAM_BOT_TOKEN is not set`
- Solution: Verify `.env` file exists and has correct token
- Ensure no whitespace around the token value

**Error**: `connect ECONNREFUSED 127.0.0.1:11434`
- Solution: Start Ollama service (`ollama serve`)
- Check Ollama is running: `curl http://localhost:11434`

**Error**: `model not found`
- Solution: Pull model with `ollama pull gemma3:12b`
- Verify OLLAMA_MODEL in .env matches available model

### High Memory Usage

**Issue**: Bot consuming excessive RAM
- Reduce `OLLAMA_NUM_CTX` (default: 8192)
- Use a smaller model (e.g., `llama3.1:8b`)
- Increase `REQUEST_TIMEOUT` for slower hardware

### Slow Response Times

**Issue**: Model responses very slow
- Check system resources (CPU/RAM/Disk)
- Consider smaller model
- Increase context window buffer time

### Telegram Connection Issues

**Error**: `AbortError: The operation was aborted`
- Verify internet connection
- Check TELEGRAM_BOT_TOKEN is correct
- Ensure no network firewall blocking Telegram API

## Docker Installation (Optional)

```bash
docker build -t fabrexa-ai .
docker run --env-file .env fabrexa-ai
```

Requires:
- Docker installed
- Ollama running on host: `--network host`

## Next Steps

1. Read [CONFIGURATION.md](./CONFIGURATION.md) to customize settings
2. Explore [FEATURES.md](./FEATURES.md) for bot capabilities
3. Review [DEVELOPMENT.md](./DEVELOPMENT.md) for development workflow
4. Create custom personalities in `personalities/` folder

## Support

For issues:
- Check troubleshooting section above
- Review GitHub issues
- Check Ollama documentation
- Verify Telegram bot setup at [BotFather](https://t.me/botfather)
