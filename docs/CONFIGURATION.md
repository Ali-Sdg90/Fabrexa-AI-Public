# Configuration Guide

Complete reference for all Fabrexa AI configuration options.

## Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

### Telegram Configuration

#### TELEGRAM_BOT_TOKEN
- **Type**: String (required)
- **Description**: Your Telegram bot authentication token
- **Example**: `123456789:ABCdefGHIjklmnoPQRstuvWXYZ...`
- **How to get**: [BotFather](https://t.me/botfather) → `/newbot`

#### OWNER_ID
- **Type**: Integer (required for private mode)
- **Description**: Your Telegram numeric user ID
- **Example**: `123456789`
- **How to get**: Send message to [@userinfobot](https://t.me/userinfobot)

#### BOT_PRIVATE
- **Type**: Boolean
- **Default**: `true`
- **Values**: 
  - `true` - Only OWNER_ID can interact with bot
  - `false` - Any Telegram user can use bot
- **Description**: Controls access level

### Ollama Configuration

#### OLLAMA_BASE_URL
- **Type**: String
- **Default**: `http://127.0.0.1:11434`
- **Description**: Ollama server address
- **Examples**:
  - Local: `http://127.0.0.1:11434`
  - Remote: `http://192.168.1.100:11434`
  - Docker: `http://ollama:11434`

#### OLLAMA_MODEL
- **Type**: String
- **Default**: `gemma3:12b`
- **Description**: Main model for chat responses
- **Recommended Models**:
  - `gemma3:12b` - Balanced (recommended)
  - `llama3.1:8b` - Fast, lightweight
  - `llama3.1:13b` - Better quality
  - `mistral:7b` - Alternative lightweight
  - `neural-chat:7b` - Chat-optimized

#### OLLAMA_ANALYZER_MODEL
- **Type**: String
- **Default**: Same as OLLAMA_MODEL
- **Description**: Optional separate model for memory analysis
- **Use Case**: Faster memory processing with smaller model

#### OLLAMA_KEEP_ALIVE
- **Type**: String
- **Default**: `10m`
- **Description**: How long to keep model loaded in memory
- **Values**: `5m`, `10m`, `1h`, `24h`, etc.
- **Impact**: Lower = faster, requires reload | Higher = memory usage

### Generation Parameters

#### OLLAMA_TEMPERATURE
- **Type**: Float (0.0 - 2.0)
- **Default**: `0.8`
- **Description**: Response randomness/creativity
- **Values**:
  - `0.0` - Deterministic, focused
  - `0.5` - Balanced, slightly creative
  - `0.8` - Creative, varied
  - `1.5+` - Very creative, less coherent

#### OLLAMA_TOP_P
- **Type**: Float (0.0 - 1.0)
- **Default**: `0.9`
- **Description**: Nucleus sampling parameter
- **Values**:
  - `0.5` - Conservative, repetitive
  - `0.9` - Balanced, natural
  - `1.0` - All tokens possible

#### OLLAMA_NUM_CTX
- **Type**: Integer
- **Default**: `8192`
- **Description**: Context window size (tokens)
- **Values**: Depends on model (typically 2048-32000)
- **Impact**:
  - Higher = better memory, more compute
  - Lower = faster, less context
- **Tip**: Match model capabilities (e.g., Llama3.1 supports 8192)

#### OLLAMA_MAX_TOKENS
- **Type**: Integer
- **Default**: `512`
- **Description**: Maximum response length
- **Range**: 1 - depends on model
- **Tip**: Balance between detail and speed

### Request Configuration

#### REQUEST_TIMEOUT
- **Type**: Integer (milliseconds)
- **Default**: `120000` (2 minutes)
- **Description**: Max wait time for AI response
- **Recommended**:
  - Fast hardware: `60000`
  - Standard hardware: `120000`
  - Slow hardware: `180000+`

#### TELEGRAM_STREAM_EDIT_INTERVAL_MS
- **Type**: Integer (milliseconds)
- **Default**: `6000` (6 seconds)
- **Description**: How often to update streaming responses
- **Impact**: Lower = more responsive | Higher = less bandwidth

### Logging Configuration

#### LOG_MODE
- **Type**: String
- **Default**: `normal`
- **Values**:
  - `normal` - Clean logs, minimal output
  - `dev-mode` - Detailed logs with payloads
  - `debug` - Debug information
  - `verbose` - All information
- **Use**: Set to `dev-mode` for troubleshooting

### Memory & Persistence

#### MEMORY_ENABLED_PERSONALITIES
- **Type**: String (comma-separated)
- **Default**: Empty (memory disabled)
- **Description**: Personality names that can use memory
- **Example**: `Sherlock,Vent Girl,Friendly`
- **Note**: Only specified personalities will have memory

#### MEMORY_PROCESSOR_CRON
- **Type**: String (cron format)
- **Default**: `0 0 * * *` (Daily at midnight)
- **Description**: Schedule for memory optimization
- **Examples**:
  - `0 * * * *` - Every hour
  - `0 0 * * *` - Daily
  - `0 0 * * 0` - Weekly (Sunday)
  - `0 0 1 * *` - Monthly

#### MEMORY_PROCESSOR_TIMEZONE
- **Type**: String (IANA timezone)
- **Default**: `Asia/Tehran`
- **Examples**:
  - `Asia/Tehran`
  - `America/New_York`
  - `Europe/London`
  - `UTC`

## Configuration Examples

### Lightweight Setup (Fast Responses)
```
OLLAMA_MODEL=llama3.1:8b
OLLAMA_NUM_CTX=4096
OLLAMA_MAX_TOKENS=256
REQUEST_TIMEOUT=60000
OLLAMA_TEMPERATURE=0.7
```

### High Quality Setup (Better Responses)
```
OLLAMA_MODEL=llama3.1:13b
OLLAMA_NUM_CTX=8192
OLLAMA_MAX_TOKENS=1024
REQUEST_TIMEOUT=180000
OLLAMA_TEMPERATURE=0.8
```

### Memory-Optimized Setup
```
OLLAMA_KEEP_ALIVE=5m
OLLAMA_NUM_CTX=4096
MEMORY_ENABLED_PERSONALITIES=Friendly,Analyst
MEMORY_PROCESSOR_CRON=0 */6 * * *
```

### Public Bot Setup
```
BOT_PRIVATE=false
OLLAMA_TEMPERATURE=0.7
OLLAMA_MAX_TOKENS=512
REQUEST_TIMEOUT=120000
```

## Performance Tuning

### For Low-End Hardware (4GB RAM)
- Use `llama3.1:8b` or smaller
- Set `OLLAMA_NUM_CTX=2048`
- Set `OLLAMA_KEEP_ALIVE=5m`
- Disable memory: `MEMORY_ENABLED_PERSONALITIES=`

### For Mid-Range Hardware (8GB RAM)
- Use `gemma3:12b` (recommended)
- Set `OLLAMA_NUM_CTX=8192`
- Set `OLLAMA_KEEP_ALIVE=10m`

### For High-End Hardware (16GB+ RAM)
- Use `llama3.1:13b` or larger
- Set `OLLAMA_NUM_CTX=16384`
- Set `OLLAMA_KEEP_ALIVE=30m`
- Enable memory for multiple personalities

## Validation

Run setup verification:
```bash
npm run check
```

This validates:
- ✓ Environment variables format
- ✓ Ollama server connectivity
- ✓ Model availability
- ✓ Telegram token validity

## Troubleshooting

### Invalid Configuration
**Error**: `OLLAMA_NUM_CTX exceeds model maximum`
- Solution: Reduce OLLAMA_NUM_CTX or check model specs
- Tip: Start with 8192, adjust down if errors occur

**Error**: `Invalid MEMORY_PROCESSOR_CRON`
- Solution: Use valid cron syntax (check crontab.guru)
- Example: `0 0 * * *` (daily at midnight)

**Error**: `Unknown timezone`
- Solution: Use IANA timezone format
- List: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones

### Performance Issues
- Reduce OLLAMA_NUM_CTX
- Decrease OLLAMA_MAX_TOKENS
- Use smaller model (OLLAMA_MODEL)
- Increase REQUEST_TIMEOUT for slow systems

## Next Steps

1. Review [FEATURES.md](./FEATURES.md) for bot capabilities
2. Check [DEVELOPMENT.md](./DEVELOPMENT.md) for development
3. See [INSTALLATION.md](./INSTALLATION.md) for setup help
