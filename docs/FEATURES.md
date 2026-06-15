# Features & Usage Guide

Comprehensive overview of Fabrexa AI capabilities and how to use them.

## Core Features

### 1. Local AI Chat
Interact with locally-hosted AI models without internet dependencies or API costs.

**How to Use**:
- Send any message to the bot
- Receive streamed responses in real-time
- Each message is processed by your configured Ollama model

**Configuration**:
- Change model: `OLLAMA_MODEL` in .env
- Adjust response length: `OLLAMA_MAX_TOKENS`
- Control creativity: `OLLAMA_TEMPERATURE`

### 2. Personality System
Deploy the bot with different AI personalities, each with unique behavior and tone.

**Built-in Personalities**:
- `friendly` - Helpful, casual tone
- `professional` - Formal, business-oriented
- `analytical` - Data-driven, detailed
- `creative` - Imaginative, story-focused

**Custom Personalities**:
1. Create file: `personalities/MyPersonality.txt`
2. Write system prompt (this defines the personality)
3. Bot loads all personalities automatically

**Example Personality File**:
```
You are a helpful AI assistant who specializes in coding.
You always provide clear explanations and working code examples.
You use professional language but remain approachable.
When asked about non-coding topics, politely redirect to coding.
```

**Using Personalities**:
- Default personality: `friendly`
- Set personality: Use `/personality` command or configure in code
- Each user can have their own personality preference

### 3. Smart Memory System
The bot learns and remembers conversations with users for contextual responses.

**Memory Features**:
- Automatic conversation history tracking
- Intelligent summarization of long conversations
- Memory-aware responses for better context
- Optional per-personality memory storage

**Enable Memory**:
```env
MEMORY_ENABLED_PERSONALITIES=Personality1,Personality2
MEMORY_PROCESSOR_CRON=0 0 * * *
```

**Memory Processing**:
- Automatic daily compression and optimization
- Long-term vs short-term memory separation
- Configurable via cron schedule
- Manual trigger: `npm run memory-process`

**Memory Storage**:
- Location: `chat_memory/{USER_ID}/`
- Files:
  - `memory-short-term.json` - Recent conversations
  - `memory-long-term.json` - Summarized history
  - `session_*.txt` - Individual session logs
  - `meta.json` - User metadata

### 4. Real-time Streaming Responses
Watch responses appear in real-time as the model generates them.

**How It Works**:
- Responses stream to Telegram as they're generated
- Message updates every 6 seconds (configurable)
- No need to wait for complete response

**Configuration**:
- Update interval: `TELEGRAM_STREAM_EDIT_INTERVAL_MS`
- Faster updates = more responsive (higher bandwidth)
- Slower updates = less bandwidth usage

### 5. Access Control
Restrict bot usage to yourself or allow public access.

**Private Mode** (recommended for personal use):
```env
BOT_PRIVATE=true
OWNER_ID=YOUR_TELEGRAM_ID
```
- Only you can use the bot
- Ideal for personal AI assistant

**Public Mode** (for shared/service bots):
```env
BOT_PRIVATE=false
```
- Any Telegram user can interact
- Useful for public services or communities

### 6. Configurable Generation Parameters
Fine-tune AI responses for your needs.

**Available Parameters**:

| Parameter | Purpose | Low Value | High Value |
|-----------|---------|-----------|-----------|
| Temperature | Creativity | Focused, repetitive | Creative, random |
| Top-P | Token diversity | Conservative | Exploratory |
| Num Context | Memory length | Fast, limited | Slow, comprehensive |
| Max Tokens | Response length | Brief | Detailed |

**Examples**:
- **Creative Writing**: Temperature=1.2, MaxTokens=1024
- **Code Generation**: Temperature=0.5, MaxTokens=2048
- **Question Answering**: Temperature=0.7, MaxTokens=512

### 7. Multiple Model Support
Switch between different AI models based on your needs.

**Available Models** (via Ollama):
- `gemma3:12b` - Balanced performance (recommended)
- `llama3.1:8b` - Lightweight and fast
- `llama3.1:13b` - High quality responses
- `mistral:7b` - Fast inference
- `neural-chat:7b` - Chat-optimized

**Switch Models**:
1. Pull new model: `ollama pull llama3.1:13b`
2. Update .env: `OLLAMA_MODEL=llama3.1:13b`
3. Restart bot: `npm start`

**Separate Analyzer Model**:
```env
OLLAMA_ANALYZER_MODEL=mistral:7b
```
Use lighter model for memory analysis while keeping main model heavy.

### 8. Scheduled Tasks
Background processing and maintenance tasks.

**Memory Optimization**:
- Runs on cron schedule (default: daily at midnight)
- Compresses long-term memory
- Analyzes and summarizes conversations
- Frees up storage space

**Configuration**:
```env
MEMORY_PROCESSOR_CRON=0 0 * * *        # Daily at 00:00
MEMORY_PROCESSOR_TIMEZONE=Asia/Tehran
```

**Manual Processing**:
```bash
npm run memory-process
```

### 9. Logging & Debugging
Detailed logs for troubleshooting and monitoring.

**Log Modes**:

**Normal Mode** (production):
```env
LOG_MODE=normal
```
- Clean, minimal output
- Only important messages
- Best for production deployment

**Development Mode** (debugging):
```env
LOG_MODE=dev-mode
```
- Detailed logs with payloads
- Full Ollama metadata
- Request/response bodies
- Useful for troubleshooting

**Enable Debugging**:
1. Set: `LOG_MODE=dev-mode`
2. Restart: `npm run dev`
3. Monitor output for detailed information

## Usage Examples

### Basic Chat
```
User: Hello! How are you?
Bot: I'm doing well, thank you for asking! How can I assist you today?
```

### Code Generation
```
User: Write a function to sort an array
Bot: Here's a JavaScript function to sort an array:

function sortArray(arr) {
  return arr.sort((a, b) => a - b);
}

This uses JavaScript's built-in sort method with a comparator function...
```

### Creative Writing
```
User: Tell me a short story
Bot: Once upon a time, in a small village nestled between mountains...
[Real-time streaming of the story]
```

### Knowledge Queries
```
User: Explain machine learning
Bot: Machine learning is a field of AI that enables systems to learn from data...
[Detailed explanation streamed in real-time]
```

## Performance Tips

### Faster Responses
- Use smaller model: `llama3.1:8b`
- Reduce context: `OLLAMA_NUM_CTX=4096`
- Reduce max tokens: `OLLAMA_MAX_TOKENS=256`
- Lower temperature: `OLLAMA_TEMPERATURE=0.5`

### Better Quality
- Use larger model: `llama3.1:13b`
- Increase context: `OLLAMA_NUM_CTX=8192`
- Enable memory: `MEMORY_ENABLED_PERSONALITIES=...`
- Higher max tokens: `OLLAMA_MAX_TOKENS=1024`

### Less Memory Usage
- Shorter keep-alive: `OLLAMA_KEEP_ALIVE=5m`
- Smaller context: `OLLAMA_NUM_CTX=4096`
- Smaller model size
- Disable personalities with memory

## Troubleshooting

### Bot Not Responding
1. Check Ollama running: `curl http://localhost:11434`
2. Verify token in .env
3. Check model exists: `ollama list`
4. Review logs: `npm run dev`

### Slow Responses
1. Reduce `OLLAMA_NUM_CTX`
2. Try smaller model
3. Check system resources (CPU/RAM)
4. Increase `REQUEST_TIMEOUT` in .env

### Memory Issues
1. Disable memory: `MEMORY_ENABLED_PERSONALITIES=`
2. Reduce context window
3. Use lighter model for analysis
4. Run manual cleanup: `npm run memory-process`

### Telegram Errors
1. Verify bot token: [BotFather](https://t.me/botfather)
2. Check internet connection
3. Verify Telegram API status
4. Review logs for specific error

## Next Steps

1. Review [CONFIGURATION.md](./CONFIGURATION.md) for all options
2. Check [DEVELOPMENT.md](./DEVELOPMENT.md) for development
3. Explore personality system in `personalities/` folder
4. Customize for your use case
