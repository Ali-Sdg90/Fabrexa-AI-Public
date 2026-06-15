# Troubleshooting Guide

Solutions for common issues and error messages.

## Setup & Installation Issues

### Node.js Version Error
**Error**: `Node version must be 18.0.0 or higher`

**Solution**:
1. Check version: `node --version`
2. Update Node.js from https://nodejs.org/
3. Restart terminal/console after update
4. Verify: `node --version`

### npm Installation Fails
**Error**: `npm ERR! 404 Not Found`

**Solution**:
1. Clear npm cache: `npm cache clean --force`
2. Delete `node_modules` and `package-lock.json`
3. Reinstall: `npm install`

**Alternative**:
- Use Node.js LTS version
- Try with `npm ci` instead of `npm install`

### Missing Dependencies
**Error**: `Cannot find module 'telegraf'`

**Solution**:
```bash
npm install
npm list telegraf
```

Verify `node_modules/` exists and contains packages.

### Ollama Installation Issues

**Windows Installation Fails**:
- Download from: https://ollama.ai
- Disable antivirus temporarily during installation
- Install to default location
- Restart computer

**macOS/Linux Issues**:
```bash
# Verify installation
ollama --version

# Reinstall
# macOS: brew install ollama
# Ubuntu: curl https://ollama.ai/install.sh | sh
```

## Configuration Issues

### TELEGRAM_BOT_TOKEN Error
**Error**: `TELEGRAM_BOT_TOKEN is not set`

**Solution**:
1. Get token from [@BotFather](https://t.me/botfather)
2. Create `.env` file: `cp .env.example .env`
3. Add token: `TELEGRAM_BOT_TOKEN=your_token`
4. Verify no extra spaces or quotes
5. Restart bot

**Token Format Issues**:
- Correct: `123456789:ABCdefGHIjklmnoPQRstuvWXYZ...`
- Wrong: `"123456789:..."` (remove quotes)
- Wrong: `123456789 : ABC...` (no spaces)

### OWNER_ID Validation Error
**Error**: `OWNER_ID must be a numeric Telegram user id`

**Solution**:
1. Get your ID from [@userinfobot](https://t.me/userinfobot)
2. Add to .env: `OWNER_ID=123456789`
3. Ensure it's numeric (no quotes, spaces, or dashes)
4. Set `BOT_PRIVATE=false` to disable owner check
5. Restart bot

**Verification**:
- ID should be 8-10 digits
- No letters or special characters
- Example: `123456789`

### .env File Not Found
**Error**: Bot starts with default values, no settings applied

**Solution**:
1. Verify file exists: `ls -la .env` or `dir .env`
2. Create if missing: `cp .env.example .env`
3. Edit with text editor (not Word)
4. Save as UTF-8 encoding
5. Restart bot

### Invalid Environment Variables
**Error**: `Invalid temperature value: abc`

**Solution**:
1. Check .env for typos
2. Numeric values shouldn't have quotes
3. Correct: `OLLAMA_TEMPERATURE=0.8`
4. Wrong: `OLLAMA_TEMPERATURE="0.8"` or `OLLAMA_TEMPERATURE=0.8.8`
5. Review types in [CONFIGURATION.md](./CONFIGURATION.md)

## Ollama Issues

### Ollama Server Not Responding
**Error**: `connect ECONNREFUSED 127.0.0.1:11434`

**Solution**:
1. Start Ollama service
   - Windows: Should auto-start (check system tray)
   - macOS: `ollama serve`
   - Linux: `ollama serve` or `systemctl start ollama`
2. Test connection: `curl http://localhost:11434`
3. Check firewall isn't blocking port 11434
4. If remote Ollama: Update `OLLAMA_BASE_URL` in .env

### Model Not Found Error
**Error**: `model not found` or `status code 404`

**Solution**:
1. List available models: `ollama list`
2. Pull required model: `ollama pull gemma3:12b`
3. Verify model name in .env matches exactly
4. Common typos: `gemma` (missing version), `llama` (missing version)
5. Restart bot

**Model Download Issues**:
- Ensure internet connection is working
- Check disk space (models are large)
- Try: `ollama pull llama3.1:8b` (smaller model)
- If still failing: Manual download from ollama.ai/library

### Out of Memory (OOM)
**Error**: `CUDA out of memory` or system freezes

**Solution**:
1. Reduce context: `OLLAMA_NUM_CTX=4096` (default 8192)
2. Use smaller model: `OLLAMA_MODEL=llama3.1:8b`
3. Reduce keep-alive: `OLLAMA_KEEP_ALIVE=5m`
4. Increase swap space (if available)
5. Close other applications
6. Upgrade hardware or use cloud service

**Prevention**:
- Know your hardware limits
- Start with small models
- Gradually increase context/model size
- Monitor resource usage

### Model Loading Too Slow
**Error**: First response takes 30+ seconds

**Solution**:
1. Model is loading on first request (normal)
2. Increase `REQUEST_TIMEOUT`: `120000` → `180000`
3. Increase `OLLAMA_KEEP_ALIVE` to keep loaded
4. Use SSD storage (faster than HDD)
5. Consider upgrading to faster GPU/CPU

**Expected Times**:
- CPU-only: 30-120 seconds first response
- GPU: 5-15 seconds first response
- Subsequent requests: Much faster

## Telegram Issues

### Invalid Telegram Token
**Error**: Bot won't start or authentication fails

**Solution**:
1. Verify token from [@BotFather](https://t.me/botfather)
2. Token format: `123456789:ABCdefGHIjklmnoPQRstuvWXYZ...`
3. Copy entire token (very long string)
4. Update .env exactly as shown
5. No quotes or extra characters

**Token Regeneration**:
1. Open BotFather: [@BotFather](https://t.me/botfather)
2. Command: `/mybots` → Select bot → `/revoke`
3. Generates new token
4. Update .env with new token

### Bot Not Responding to Messages
**Error**: Send message to bot, no response

**Solution**:
1. Verify bot running: Check terminal output
2. Check private mode: `BOT_PRIVATE=true` requires OWNER_ID match
3. Get your ID: [@userinfobot](https://t.me/userinfobot)
4. Update .env: `OWNER_ID=your_id`
5. Restart bot
6. Try again

**Debug Steps**:
```bash
npm run dev  # Enable detailed logging
# Send test message to bot
# Check console for errors
```

### Cannot Find Bot in Telegram
**Error**: Bot doesn't appear in search

**Solution**:
1. Verify bot token is active in BotFather
2. Start bot: `npm start`
3. Bot name in Telegram: [@BotFather](https://t.me/botfather)
4. Search by username (given during `/newbot`)
5. Wait a few seconds for Telegram to index

### Message Not Sending/Receiving
**Error**: Messages stuck or no response

**Solution**:
1. Check internet connection
2. Verify Telegram API availability
3. Check bot logs: `npm run dev`
4. Verify token is still valid
5. Restart bot
6. Try different network/VPN if blocked

**Network Issues**:
- Try different network
- Check if Telegram is blocked in your region
- Use VPN if necessary
- Verify firewall allows outbound HTTPS

## Performance Issues

### Slow Response Times
**Issue**: Bot takes 30+ seconds to respond consistently

**Solution**:
1. Check system resources:
   - CPU usage
   - RAM usage
   - Disk space
2. Reduce model complexity:
   - Use `llama3.1:8b` instead of larger
   - Reduce `OLLAMA_NUM_CTX` from 8192 to 4096
   - Reduce `OLLAMA_MAX_TOKENS` from 512 to 256
3. Increase timeout for your hardware:
   ```env
   REQUEST_TIMEOUT=180000
   ```
4. Check if Ollama is processing other requests
5. Consider hardware upgrade

### High Memory Usage
**Issue**: Bot using 4GB+ RAM

**Solution**:
1. Reduce context window:
   ```env
   OLLAMA_NUM_CTX=4096
   ```
2. Use lighter model:
   ```env
   OLLAMA_MODEL=llama3.1:8b
   ```
3. Disable memory features:
   ```env
   MEMORY_ENABLED_PERSONALITIES=
   ```
4. Reduce keep-alive:
   ```env
   OLLAMA_KEEP_ALIVE=2m
   ```
5. Monitor: `top` (Linux) or Task Manager (Windows)

### High CPU Usage
**Issue**: Bot using 90%+ CPU continuously

**Solution**:
1. Reduce temperature (less entropy):
   ```env
   OLLAMA_TEMPERATURE=0.5
   ```
2. Use smaller model
3. Check for runaway processes
4. Limit concurrent requests
5. Try GPU acceleration if available

## Memory System Issues

### Memory Not Saving
**Error**: Conversations not remembered

**Solution**:
1. Check personality is enabled:
   ```env
   MEMORY_ENABLED_PERSONALITIES=YourPersonality
   ```
2. Verify `chat_memory/` directory exists
3. Check permissions: `chmod 755 chat_memory`
4. Run manual processor: `npm run memory-process`
5. Check output in `chat_memory/{USER_ID}/`

### Memory Files Corrupted
**Error**: `SyntaxError` in memory processing

**Solution**:
1. Backup memory files
2. Delete corrupted file
3. Restart bot (new file created)
4. Test again

**Recovery**:
```bash
# Backup first
cp -r chat_memory chat_memory.bak

# Delete specific user memory
rm -rf chat_memory/{USER_ID}

# Restart bot
npm start
```

### Memory Processor Not Running
**Error**: Memory not optimizing on schedule

**Solution**:
1. Verify cron format: `0 0 * * *` (daily at midnight)
2. Check timezone: `MEMORY_PROCESSOR_TIMEZONE=Asia/Tehran`
3. Run manually: `npm run memory-process`
4. Review logs: `npm run dev`
5. Check system cron/task scheduler

## Code & Linting Issues

### ESLint Errors
**Error**: `npm run lint` fails

**Solution**:
1. See specific error: `npm run lint`
2. Most can auto-fix: `npx eslint --fix src/`
3. Fix manually if needed (see eslint.config.js)
4. Run again to verify

### Code Quality Issues
**Error**: Specific linting warnings

**Common Issues**:
- Missing semicolons
- Inconsistent spacing
- Unused variables
- Complex functions

**Fix**:
```bash
npx eslint --fix src/
npm run lint  # Verify
```

## General Troubleshooting

### Getting Help
1. Read [INSTALLATION.md](./INSTALLATION.md)
2. Check [CONFIGURATION.md](./CONFIGURATION.md)
3. Review [DEVELOPMENT.md](./DEVELOPMENT.md)
4. Enable debug: `LOG_MODE=dev-mode`
5. Check system logs/console output

### Collecting Debug Info
When reporting issues, include:
```bash
# Version information
node --version
npm --version
ollama --version

# Environment (safe to share)
LOG_MODE=dev-mode
# Run bot and capture output

# Error message (full text)
# Steps to reproduce
```

### Safe Debugging Steps
```bash
# 1. Verify setup
npm run check

# 2. Enable debug logging
# Edit .env: LOG_MODE=dev-mode

# 3. Run with full logging
npm run dev

# 4. Send test message to bot
# Check console output for errors

# 5. Capture output for analysis
npm run dev 2>&1 | tee debug.log
```

### Restart & Reset
**Full Reset**:
```bash
# Stop bot (Ctrl+C)
# Kill any remaining processes
killall node        # macOS/Linux
taskkill /IM node.exe  # Windows

# Clear old files
npm run clean
npm install

# Verify setup
npm run check

# Restart
npm start
```

## Prevention Tips

1. **Backup configuration**: Keep copy of working .env
2. **Monitor resources**: Watch CPU/RAM during operation
3. **Update regularly**: Keep Node.js and Ollama current
4. **Test thoroughly**: Always test changes in dev mode
5. **Keep logs**: Save logs for debugging later
6. **Regular cleanup**: Run memory processor regularly

## Still Stuck?

1. Enable `LOG_MODE=dev-mode` and check output
2. Review relevant documentation file
3. Check project README and guides
4. Verify all prerequisites are installed
5. Try minimal configuration to isolate issue

