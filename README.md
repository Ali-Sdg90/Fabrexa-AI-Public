# Fabrexa AI - Telegram Bot

Fabrexa AI is a Telegram bot that runs fully locally through Ollama. It supports personality prompts, conversation logs, owner-only access, and smart long-term memory.

## Features

- Local AI responses through Ollama `/api/chat`
- Model selection from `.env`
- Personality prompts from `personalities/*.txt`
- Owner-only Telegram access
- Smart memory stored in local JSON files
- No hosted AI API key required

## Prerequisites

- Node.js 18+
- npm
- Ollama installed and running
- Telegram bot token from [@BotFather](https://t.me/botfather)

Pull the model you want to use:

```bash
ollama pull llama3.1
```

## Installation

```bash
npm install
copy .env.example .env
```

On Linux/macOS:

```bash
cp .env.example .env
```

Edit `.env`:

```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
OWNER_ID=123456789
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3.1
```

`OLLAMA_MODEL` is the model shown in Telegram while the bot is processing. `AI_MODEL` and `MODEL` are also accepted as fallback aliases.

## Run

Start Ollama first:

```bash
ollama serve
```

Then start the bot:

```bash
npm start
```

Or use:

```bash
npm run dev
npm run check
npm run memory-process
```

`npm run memory-process` manually runs the short-term to long-term memory processor.

## Memory System

Fabrexa uses a two-layer local memory pipeline:

- `memory-short-term.json` stores temporary memory candidates from chat.
- `memory-long-term.json` stores stable memories used in model prompts.

Short-term memories include expiry dates and statuses such as `active`, `promoted`, `expired`, and `archived`. The memory processor runs automatically at midnight while the bot is running, and can also be triggered manually with `npm run memory-process`.

Only active long-term memories are included in the model prompt. Short-term memories are processor input and are not sent to the model on every message.

## Telegram Commands

| Command  | Description |
| -------- | ----------- |
| `/start` | Start Fabrexa and show the local model |

The bot also provides reply-keyboard buttons for new chats, personality changes, and memory viewing.

## Configuration

- `TELEGRAM_BOT_TOKEN` - required Telegram bot token
- `OWNER_ID` - required Telegram user ID allowed to use the bot
- `OLLAMA_BASE_URL` - local Ollama server URL
- `OLLAMA_MODEL` - main chat model
- `OLLAMA_ANALYZER_MODEL` - optional model for memory analysis
- `LOG_MODE` - use `normal` for clean logs or `dev-mode` for Ollama payload and timing logs
- `REQUEST_TIMEOUT` - request timeout in milliseconds
- `TELEGRAM_STREAM_EDIT_INTERVAL_MS` - minimum delay between streamed Telegram message edits, default `6000`
- `MEMORY_PROCESSOR_CRON` - cron expression for automatic memory processing, default `0 0 * * *`
- `MEMORY_PROCESSOR_TIMEZONE` - timezone for the memory cron job, default `Asia/Tehran`
- `OLLAMA_KEEP_ALIVE` - Ollama model keep-alive value
- `OLLAMA_NUM_CTX` - context window
- `OLLAMA_TEMPERATURE` - response creativity
- `OLLAMA_TOP_P` - nucleus sampling
- `OLLAMA_MAX_TOKENS` - response token limit

## Project Structure

```text
Fabrexa-AI/
├── bot.js
├── check-setup.js
├── src/
│   ├── ai/
│   ├── bot/
│   ├── config/
│   ├── memory/
│   └── personalities/
├── personalities/
├── chat_memory/
└── .env.example
```

## Troubleshooting

- If the bot does not start, run `npm run check`
- If responses fail, run `ollama serve`
- If the model is missing, run `ollama pull your_model_name`
- If Telegram rejects the bot token, check `TELEGRAM_BOT_TOKEN`
- If the bot ignores you, check `OWNER_ID`
