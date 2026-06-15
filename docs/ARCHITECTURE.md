# Architecture & Technical Reference

System design, data flow, and technical specifications for Fabrexa AI.

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Telegram Network                         │
└────────────────┬──────────────────────────────┬─────────────┘
                 │                              │
            ┌────▼────────────────────────────▼────┐
            │      Fabrexa AI Bot (Node.js)        │
            │  ┌──────────────────────────────┐    │
            │  │   Telegram Handler           │    │
            │  │ (Telegraf Framework)         │    │
            │  └────────────┬─────────────────┘    │
            │               │                       │
            │  ┌────────────▼────────────────┐     │
            │  │   Message Processing        │     │
            │  │  - Routing                  │     │
            │  │  - Access Control           │     │
            │  │  - Rate Limiting            │     │
            │  └────────────┬────────────────┘     │
            │               │                       │
            │  ┌────────────▼──────────────────┐   │
            │  │   Personality Manager         │   │
            │  │  - Load Personalities         │   │
            │  │  - Select Active Personality  │   │
            │  │  - Build System Prompt        │   │
            │  └────────────┬──────────────────┘   │
            │               │                       │
            │  ┌────────────▼──────────────────┐   │
            │  │   Memory System               │   │
            │  │  - Load Conversation History  │   │
            │  │  - Prepare Memory Context     │   │
            │  │  - Save Response to Memory    │   │
            │  └────────────┬──────────────────┘   │
            │               │                       │
            │  ┌────────────▼──────────────────┐   │
            │  │   AI Request Builder          │   │
            │  │  - Combine Context            │   │
            │  │  - Set Generation Parameters  │   │
            │  │  - Format Request             │   │
            │  └────────────┬──────────────────┘   │
            └───────────────┼──────────────────────┘
                            │
        ┌───────────────────▼──────────────────┐
        │     Ollama Server (Local AI)         │
        │  ┌──────────────────────────────┐    │
        │  │  Selected Model              │    │
        │  │  - gemma3:12b                │    │
        │  │  - llama3.1:x                │    │
        │  │  - Other Models              │    │
        │  └──────────────────────────────┘    │
        │                                      │
        │  ┌──────────────────────────────┐    │
        │  │  Generation Engine           │    │
        │  │  - Token Generation          │    │
        │  │  - Context Management        │    │
        │  │  - Response Streaming        │    │
        │  └──────────────────────────────┘    │
        └──────────────────────────────────────┘
```

## Data Flow

### Message Processing Pipeline

1. **Telegram Message Received**
   - User sends message via Telegram
   - Telegram servers forward to bot
   - Webhooks or polling delivers to bot

2. **Bot Reception & Validation**
   - Telegraf framework receives message
   - Extract metadata (user, chat, timestamp)
   - Validate message format

3. **Access Control**
   - Check if user authorized (if BOT_PRIVATE)
   - Rate limiting (optional)
   - Permission validation

4. **Personality Selection**
   - Load active personality
   - Build system prompt
   - Prepare instructions

5. **Memory Loading**
   - Retrieve user's conversation history
   - Summarize relevant context
   - Prepare memory window

6. **AI Request Assembly**
   - Combine system prompt + memory + new message
   - Apply generation parameters
   - Format Ollama API request

7. **Ollama Processing**
   - Send request to Ollama
   - Model generates response tokens
   - Stream tokens back to bot

8. **Response Streaming**
   - Bot receives token stream
   - Buffer and format response
   - Update Telegram message periodically

9. **Memory Storage**
   - Save user message to memory
   - Save bot response to memory
   - Update user metadata

10. **Response Complete**
    - Final message sent to user
    - Cleanup and logging

### Conversation Memory Flow

```
┌─ New Message from User
│
├─ Load Short-Term Memory
│  └─ Recent conversations (last 20-30 messages)
│
├─ (Optional) Load Long-Term Memory
│  └─ Summarized conversation history
│
├─ Combine Contexts
│  ├─ System prompt (personality)
│  ├─ Long-term memory (history summary)
│  ├─ Short-term memory (recent messages)
│  └─ Current user message
│
├─ Send to AI Model
│  └─ Ollama generates response
│
├─ Save to Memory
│  ├─ Append user message to short-term
│  ├─ Append bot response to short-term
│  └─ Update metadata
│
└─ (Scheduled) Memory Compression
   ├─ Analyze short-term memory
   ├─ Summarize old messages
   ├─ Archive to long-term
   └─ Clear old short-term entries
```

## Module Specifications

### Configuration Module (`src/config/`)

**Purpose**: Centralized configuration management

**Responsibilities**:
- Load environment variables
- Validate configuration
- Provide defaults
- Export runtime config

**Key Exports**:
```
TELEGRAM_BOT_TOKEN
BOT_PRIVATE
OWNER_ID
OLLAMA_BASE_URL
OLLAMA_MODEL
OLLAMA_NUM_CTX
OLLAMA_TEMPERATURE
LOG_MODE
... (40+ config options)
```

**Validation**:
- Required fields present
- Types correct
- Values in valid ranges
- File access permissions

### AI Module (`src/ai/`)

**Purpose**: Ollama integration and model management

**Components**:

**client.js**:
- HTTP communication with Ollama
- Request/response handling
- Stream management
- Error handling

**config.js**:
- Model configuration
- Generation parameters
- Request formatting
- Response parsing

**Key Functions**:
```
chat(messages, config)      # Send chat request
stream(messages, config)    # Stream response
models()                    # List available models
health()                    # Check server status
```

### Bot Module (`src/bot/`)

**Purpose**: Telegram integration and message routing

**Structure**:
- `index.js` - Bot initialization
- `handlers/` - Message handlers
- `middleware/` - Request processing
- `utils/` - Helper functions

**Message Flow**:
```
Request → Middleware → Handler → Response
```

**Handlers**:
- Message handler - Regular messages
- Command handler - /commands
- Error handler - Exception catching

**Middleware**:
- Authentication
- Logging
- Error wrapping
- Context enrichment

### Memory Module (`src/memory/`)

**Purpose**: Conversation history and learning

**Components**:

**index.js**:
- Public API
- Load/save memory
- Memory interface

**analyzer.js**:
- Summarization
- Memory analysis
- Compression logic

**processor.js**:
- Background task
- Cron scheduling
- Batch processing

**memoryService.js**:
- Core memory operations
- File I/O
- Data structure management

**access.js**:
- Permission checking
- User-based access

**Data Structure**:
```json
{
  "userId": "123456789",
  "shortTerm": [
    {
      "role": "user|assistant",
      "content": "message text",
      "timestamp": "ISO8601"
    }
  ],
  "longTerm": [
    {
      "period": "2024-01-01 to 2024-01-07",
      "summary": "summary text",
      "keyPoints": ["point1", "point2"]
    }
  ],
  "metadata": {
    "firstSeen": "ISO8601",
    "lastSeen": "ISO8601",
    "totalMessages": 150
  }
}
```

### Personality Module (`src/personalities/`)

**Purpose**: AI personality management

**System Prompt Template**:
```
You are [personality description].
[Behavior guidelines]
[Communication style]
[Constraints and rules]

Recent context:
{memory_context}

User message: {user_message}
```

**Personality Files** (`personalities/*.txt`):
- Plain text system prompts
- One per file
- Loaded on startup
- Can be hot-reloaded

## API Reference

### Ollama Chat API

**Endpoint**: `POST /api/chat`

**Request Format**:
```json
{
  "model": "gemma3:12b",
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant..."
    },
    {
      "role": "user",
      "content": "Hello!"
    }
  ],
  "stream": true,
  "options": {
    "temperature": 0.8,
    "top_p": 0.9,
    "num_ctx": 8192,
    "num_predict": 512
  }
}
```

**Response Format** (streaming):
```json
{
  "model": "gemma3:12b",
  "created_at": "2024-01-15T10:30:00.000Z",
  "message": {
    "role": "assistant",
    "content": "token"
  },
  "done": false
}
```

**Final Response**:
```json
{
  "done": true,
  "total_duration": 5000000000,
  "load_duration": 1000000000,
  "prompt_eval_count": 26,
  "prompt_eval_duration": 2000000000,
  "eval_count": 20,
  "eval_duration": 2000000000
}
```

### Telegram Bot API (via Telegraf)

**Key Methods**:
```javascript
bot.on('message', handler)          // Message events
bot.command('start', handler)       // /start command
bot.action('button_id', handler)    // Button clicks
ctx.reply(text)                     // Send message
ctx.editMessageText(text)           // Edit message
ctx.sendChatAction('typing')        // Show typing
```

## Performance Characteristics

### Response Time Breakdown

| Phase | Time (CPU) | Time (GPU) | Notes |
|-------|-----------|-----------|-------|
| Model Load | 5-10s | 1-3s | One-time per session |
| Prompt Encode | 1-2s | 0.5s | Process input tokens |
| Token Generation | 1-5s per token | 0.2s per token | Main processing |
| Total (100 tokens) | 2-10min | 20-40s | Rough estimates |

### Memory Usage

| Component | Typical Usage |
|-----------|--------------|
| Node.js base | 50-100 MB |
| Ollama connection | 10-20 MB |
| Memory cache | 5-50 MB |
| Personality files | <1 MB |
| Total (without model) | ~100 MB |
| Model (7B params) | 4-7 GB |
| Model (13B params) | 8-14 GB |

### Scalability

**Single Bot Instance Limits**:
- Users: Unlimited (depends on hardware)
- Messages/sec: 10-20 (rate limited by Ollama)
- Concurrent requests: 1-3 (sequential processing)
- Memory conversations: 100-1000s per user

**Bottlenecks**:
1. Ollama processing speed (primary)
2. Hardware RAM/VRAM
3. Model size
4. Context window
5. Network bandwidth

## Error Handling

### Error Categories

**Configuration Errors** (Fatal):
- Missing required environment variables
- Invalid token format
- Invalid numeric values

**Connection Errors** (Recoverable):
- Ollama server unreachable
- Telegram API timeout
- Network interruption

**Processing Errors** (Recoverable):
- Invalid input format
- Model generation failure
- Memory access failure

**Recovery Strategies**:
1. Log error with context
2. Inform user (if applicable)
3. Attempt retry (for transient errors)
4. Fallback to default behavior
5. Graceful degradation

## Security Considerations

### Access Control
- Private mode: Only OWNER_ID
- Verification at handler level
- Per-message validation

### Data Privacy
- Memories stored locally
- No cloud transmission
- User isolation by ID
- No external logging

### Input Validation
- Message length limits
- Command format validation
- Parameter type checking
- Rate limiting ready

## Deployment Architecture

### Single Instance (Development)
```
Bot → Ollama (local)
```

### Distributed (Production)
```
Bot (Node) → Ollama (separate server)
          → PostgreSQL (optional persistence)
          → Redis (optional caching)
```

### Container Deployment
```
Docker Container
├── Node.js 18+
├── Fabrexa AI Bot
└── Connection to Ollama (host network)
```

## Future Enhancement Opportunities

1. **Caching Layer**: Redis for memory speedup
2. **Database**: PostgreSQL for persistence
3. **Multi-Bot**: Handle multiple bot tokens
4. **Clustering**: Horizontal scaling
5. **Monitoring**: Prometheus/Grafana integration
6. **API Server**: Expose bot as HTTP API
7. **Plugin System**: Custom handlers
8. **Advanced Memory**: Semantic search, embeddings

## Configuration Flags & Toggles

### Feature Flags
- Memory system: `MEMORY_ENABLED_PERSONALITIES`
- Private mode: `BOT_PRIVATE`
- Debug logging: `LOG_MODE=dev-mode`

### Performance Tuning
- Context window: `OLLAMA_NUM_CTX`
- Generation speed: `OLLAMA_TEMPERATURE`
- Response length: `OLLAMA_MAX_TOKENS`
- Request timeout: `REQUEST_TIMEOUT`

### Integration Points
- Ollama: `OLLAMA_BASE_URL`
- Telegram: `TELEGRAM_BOT_TOKEN`
- Personality system: `personalities/` folder
- Memory storage: `chat_memory/` folder

