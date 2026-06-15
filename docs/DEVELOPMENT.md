# Development Guide

Development workflow, architecture, and contribution guidelines for Fabrexa AI.

## Project Architecture

### Directory Structure

```
Fabrexa-AI/
├── src/
│   ├── ai/                 # Ollama integration
│   │   ├── client.js      # Ollama API client
│   │   └── config.js      # Model configuration
│   ├── bot/               # Telegram bot
│   │   ├── index.js       # Bot initialization
│   │   ├── handlers/      # Message handlers
│   │   ├── middleware/    # Request processing
│   │   └── utils/         # Helper functions
│   ├── config/            # Configuration management
│   │   └── index.js       # Environment variables
│   ├── memory/            # Conversation memory
│   │   ├── index.js       # Memory interface
│   │   ├── analyzer.js    # Memory analysis
│   │   ├── processor.js   # Background processor
│   │   ├── access.js      # Memory access control
│   │   └── memoryService.js
│   └── personalities/     # Personality management
│       └── index.js
├── chat_memory/           # User conversation data
├── personalities/         # Personality definitions
├── scripts/               # Utility scripts
├── bot.js                 # Entry point
├── package.json           # Dependencies
├── .env.example           # Configuration template
└── eslint.config.js       # Code quality rules
```

### Core Modules

**AI Module** (`src/ai/`):
- Communicates with Ollama server
- Handles model configuration
- Manages chat requests and streaming

**Bot Module** (`src/bot/`):
- Telegraf framework integration
- Message handling and routing
- Command processing
- Middleware pipeline

**Memory Module** (`src/memory/`):
- Conversation history management
- Memory compression and analysis
- Scheduled background tasks
- Access control and filtering

**Config Module** (`src/config/`):
- Environment variable validation
- Default value handling
- Runtime configuration export

## Development Environment

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup development .env**
   ```bash
   cp .env.example .env
   ```

3. **Start Ollama**
   ```bash
   ollama serve
   ```

4. **Run in development mode**
   ```bash
   npm run dev
   ```

### Available Commands

```bash
npm start              # Production mode
npm run dev           # Development with env file and logging
npm run check         # Verify environment setup
npm run lint          # ESLint code quality check
npm run memory-process # Manual memory optimization
```

### Environment Variables for Development

Recommended development .env:
```env
TELEGRAM_BOT_TOKEN=YOUR_TOKEN
OWNER_ID=YOUR_ID
BOT_PRIVATE=true
LOG_MODE=dev-mode
OLLAMA_MODEL=llama3.1:8b
REQUEST_TIMEOUT=120000
```

## Code Style & Quality

### ESLint

Check code quality:
```bash
npm run lint
```

Fix automatically (when possible):
```bash
npx eslint --fix "src/**/*.js" "scripts/**/*.js"
```

Configuration: `eslint.config.js`

### Code Conventions

1. **No Comments** - Code should be self-documenting
2. **Descriptive Names** - Use clear variable and function names
3. **Single Responsibility** - Each function does one thing
4. **Error Handling** - Always handle potential errors
5. **Async/Await** - Use async/await over promises

### Module Standards

All modules follow this pattern:
```javascript
export const functionName = async (param) => {
  // Implementation
};

export default {
  functionName,
};
```

## Common Tasks

### Adding a Personality

1. Create file: `personalities/YourPersonality.txt`
2. Write system prompt:
   ```
   You are [description].
   [Behavior guidelines]
   [Tone specifications]
   ```
3. Bot loads automatically on restart

### Adding a Command Handler

1. Create handler in `src/bot/handlers/`
2. Export handler function
3. Register in `src/bot/index.js`

### Modifying Memory Behavior

1. Edit `src/memory/analyzer.js` for analysis logic
2. Edit `src/memory/processor.js` for background tasks
3. Update config in `src/config/index.js` if needed

### Changing Generation Parameters

1. Edit `src/ai/config.js` for model configuration
2. Or pass via environment variables in .env

## Testing

### Manual Testing

Test with development mode:
```bash
npm run dev
```

Monitor logs for:
- Connection status
- Request/response payloads
- Error messages
- Performance metrics

### Testing Specific Features

**Memory System**:
```bash
npm run memory-process
```
Check output in `chat_memory/` directory

**Model Switching**:
1. Pull model: `ollama pull llama3.1:8b`
2. Update .env: `OLLAMA_MODEL=llama3.1:8b`
3. Restart bot and test responses

**Telegram Integration**:
- Send test messages to bot
- Check response timing and content
- Verify memory storage

## Performance Optimization

### Profiling

Monitor resource usage during development:
```bash
# Get system stats
npm run dev
# Watch memory/CPU in system monitor
```

### Common Bottlenecks

1. **Model Loading** - `OLLAMA_KEEP_ALIVE` affects reload time
2. **Context Processing** - `OLLAMA_NUM_CTX` directly impacts performance
3. **Memory Analysis** - Use smaller model for analysis
4. **Message Updates** - Adjust `TELEGRAM_STREAM_EDIT_INTERVAL_MS`

### Optimization Tips

- Cache personality files in memory
- Batch memory updates
- Use smaller model for analysis
- Implement request queuing for high load

## Debugging

### Enable Debug Logging

```env
LOG_MODE=dev-mode
```

Then restart with `npm run dev`

### Debug Output Includes

- Full request/response payloads
- Ollama API metadata
- Memory operation details
- Timing information

### Common Issues

**Issue: Bot initialization fails**
- Check Ollama: `curl http://localhost:11434`
- Verify token format in .env
- Check model availability: `ollama list`

**Issue: Memory not working**
- Verify personality in `MEMORY_ENABLED_PERSONALITIES`
- Check `chat_memory/` directory permissions
- Manual test: `npm run memory-process`

**Issue: Slow responses**
- Profile with `top` or system monitor
- Check Ollama resource usage
- Try smaller model

## Deployment

### Production Checklist

- [ ] Set `BOT_PRIVATE=true` or `false` as needed
- [ ] Set `LOG_MODE=normal`
- [ ] Verify `OLLAMA_KEEP_ALIVE` value
- [ ] Configure `MEMORY_PROCESSOR_CRON`
- [ ] Run `npm run check` before deploying
- [ ] Test thoroughly in staging first

### Docker Deployment

1. Build: `docker build -t fabrexa-ai .`
2. Run: `docker run --env-file .env --network host fabrexa-ai`
3. Ensure Ollama accessible from container

### Monitoring in Production

- Watch logs for errors
- Monitor memory usage
- Track response times
- Alert on bot failures

## Contributing

### Code Review Checklist

- [ ] Follows code conventions
- [ ] No unnecessary comments
- [ ] Error handling present
- [ ] Performance acceptable
- [ ] Tested with dev mode
- [ ] ESLint passes
- [ ] Works with different models

### Pull Request Process

1. Fork repository
2. Create feature branch
3. Make changes
4. Run `npm run lint`
5. Test thoroughly
6. Submit PR with description

## Useful Resources

- **Telegraf Docs**: https://telegraf.js.org/
- **Ollama API**: https://github.com/ollama/ollama/blob/main/docs/api.md
- **Node.js Best Practices**: https://nodejs.org/en/docs/guides/nodejs-performance/
- **Cron Syntax**: https://crontab.guru/
- **IANA Timezones**: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones

## Next Steps

1. Review [FEATURES.md](./FEATURES.md) for bot capabilities
2. Check [CONFIGURATION.md](./CONFIGURATION.md) for settings
3. Explore source code in `src/`
4. Start with small changes and test thoroughly
