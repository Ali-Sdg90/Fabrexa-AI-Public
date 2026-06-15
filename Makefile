.PHONY: help install run dev check memory-process clean update lint

help:
	@echo "Fabrexa AI Bot - Available Commands"
	@echo "==================================="
	@echo "make install       - Install dependencies"
	@echo "make run           - Run the bot"
	@echo "make dev           - Run in development mode"
	@echo "make check         - Verify setup and dependencies"
	@echo "make memory-process - Run memory processor manually"
	@echo "make clean         - Clean node_modules and lockfile"
	@echo "make update        - Update dependencies"
	@echo "make lint          - Run ESLint"

install:
	npm install

run:
	npm start

dev:
	npm run dev

check:
	npm run check

memory-process:
	npm run memory-process

clean:
	rm -rf node_modules
	rm -f package-lock.json

update:
	npm update

lint:
	npm run lint
