# Contributing Guide

Thank you for your interest in contributing to Fabrexa AI! This guide explains how to contribute effectively.

## Code of Conduct

- Be respectful and inclusive
- Focus on code quality and functionality
- Provide constructive feedback
- Welcome new contributors

## Ways to Contribute

### Bug Reports

1. Check [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) first
2. Enable `LOG_MODE=dev-mode` and capture output
3. Document steps to reproduce
4. Include Node.js and Ollama versions
5. Share `.env` configuration (remove sensitive data)

### Feature Requests

1. Describe the use case
2. Explain why it's valuable
3. Suggest implementation approach
4. Link related discussions

### Code Contributions

1. Fork the repository
2. Create feature branch: `git checkout -b feature/description`
3. Follow code standards
4. Test thoroughly
5. Submit pull request

### Documentation

1. Fix typos and clarify explanations
2. Add examples
3. Improve organization
4. Translate to other languages

## Development Workflow

### Setup Development Environment

```bash
# Clone your fork
git clone https://github.com/yourusername/Fabrexa-AI-Public.git
cd Fabrexa-AI-Public

# Install dependencies
npm install

# Create .env for development
cp .env.example .env
# Edit .env with your settings

# Start Ollama
ollama serve

# Run in development mode
npm run dev
```

### Code Standards

**Requirements**:

- Use `async/await` for asynchronous code
- Handle all errors properly
- Use descriptive variable names
- Keep functions focused and small
- No hardcoded values (use config)

**No Comments**:

- Code should be self-documenting
- Use clear names instead of comments
- Document complex logic through structure

**Linting**:

```bash
npm run lint          # Check code quality
npx eslint --fix src/ # Auto-fix issues
```

### Making Changes

1. **Single Feature Per Branch**

    ```bash
    git checkout -b feature/your-feature-name
    ```

2. **Commit Often**

    ```bash
    git add src/file.js
    git commit -m "Add feature description"
    ```

3. **Keep Commits Clean**
    - Logical changes grouped together
    - Descriptive commit messages
    - Reference issues if applicable

4. **Test Thoroughly**
    ```bash
    npm run check    # Verify setup
    npm run lint     # Code quality
    npm run dev      # Test functionality
    ```

## Pull Request Process

### Before Submitting

- [ ] Code follows standards
- [ ] `npm run lint` passes
- [ ] Changes tested locally
- [ ] Documentation updated
- [ ] No sensitive data in commits

### PR Description

Include:

- What does this change?
- Why is this change needed?
- How was it tested?
- Any breaking changes?
- Related issues/discussions

### PR Template

```markdown
## Description

Brief description of changes

## Type

- [ ] Bug fix
- [ ] Feature addition
- [ ] Documentation
- [ ] Performance improvement

## Testing

How was this tested?

## Checklist

- [ ] Code follows standards
- [ ] Lint passes: `npm run lint`
- [ ] Tested locally
- [ ] Documentation updated
- [ ] No breaking changes
```

## Contribution Areas

### Priority Areas

1. **Bug Fixes** - Always welcome
2. **Performance** - Optimization opportunities
3. **Documentation** - Clarity improvements
4. **Tests** - Coverage and reliability
5. **Features** - Aligned with project goals

### Good First Issues

Perfect for new contributors:

- Documentation improvements
- Code style consistency
- Error message improvements
- Example additions

### Advanced Areas

For experienced contributors:

- Architecture changes
- Performance optimization
- New feature design
- Integration improvements

## Git Workflow

### Basic Flow

```bash
# 1. Create feature branch
git checkout -b feature/awesome-feature

# 2. Make changes and commit
git add .
git commit -m "Implement awesome feature"

# 3. Push to your fork
git push origin feature/awesome-feature

# 4. Create Pull Request on GitHub
# Fill in the PR template
# Wait for review

# 5. Address feedback
git add .
git commit -m "Address review feedback"
git push origin feature/awesome-feature

# 6. Merge after approval
# Delete branch after merge
```

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation
- `perf/description` - Performance
- `refactor/description` - Code structure

## Testing

### Manual Testing

1. **Function Testing**

    ```bash
    npm run dev
    # Send test messages to bot
    # Verify responses are correct
    ```

2. **Feature Testing**

    ```bash
    # Enable LOG_MODE=dev-mode
    npm run dev
    # Test feature end-to-end
    # Check console for errors
    ```

3. **Integration Testing**
    ```bash
    npm run check  # Verify setup
    # Test with different configurations
    # Test with different models
    ```

### Regression Testing

Before submitting PR:

- Test existing features still work
- Verify no performance regression
- Check memory usage
- Test with different configurations

## Documentation

### When to Update Docs

- Adding new feature → Update [FEATURES.md](./docs/FEATURES.md)
- New environment variable → Update [CONFIGURATION.md](./docs/CONFIGURATION.md)
- Changing architecture → Update [ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- New command → Update [README.md](./README.md)
- Bug fix → Update [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)

### Documentation Style

- Clear and concise
- Use examples
- Include links to related docs
- Professional tone
- Suitable for resume projects

## Review Process

### What Reviewers Look For

- **Functionality** - Does it work as intended?
- **Code Quality** - Does it follow standards?
- **Performance** - Is it efficient?
- **Compatibility** - Breaks anything?
- **Documentation** - Is it clear?
- **Testing** - Is it thoroughly tested?

### Feedback

- Be specific about issues
- Suggest improvements
- Acknowledge good work
- Ask for clarification if needed

## Commit Messages

### Format

```
[Type] Short description (50 chars max)

Longer description if needed.
Explain why, not what.

Fixes #123
```

### Types

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style (formatting)
- `refactor:` - Code restructuring
- `perf:` - Performance improvement
- `test:` - Adding tests

### Examples

```
feat: Add streaming response support

Implements real-time message updates as the model generates responses.
Updates are sent every 6 seconds (configurable).

Closes #45
```

```
fix: Handle model timeout gracefully

Increase default timeout and add proper error handling
for slow model inference.

Fixes #123
```

## Release Process

### Version Numbering

Format: `MAJOR.MINOR.PATCH`

- `MAJOR` - Breaking changes
- `MINOR` - New features (backward compatible)
- `PATCH` - Bug fixes

### Release Steps

1. Update version in `package.json`
2. Update [README.md](./README.md)
3. Create changelog entry
4. Tag release: `git tag v1.2.3`
5. Push and create release on GitHub

## Getting Help

- **Questions** - Start discussion or issue
- **Stuck** - Ask in pull request comments
- **Ideas** - Open discussion for feedback
- **Issues** - Report with full context

## Resources

- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)
- [Telegraf.js Documentation](https://telegraf.js.org/)
- [Ollama API](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [Git Workflow](https://git-scm.com/book/en/v2)

## License

By contributing, you agree that your contributions will be licensed under the MIT License (same as the project).

## Thank You!

Your contributions help make this project better. We appreciate:

- Your time
- Your skills
- Your ideas
- Your patience

Together we build something great!

---

**Questions?** Open an issue or start a discussion.
**Ready to contribute?** Fork the repo and get started!
