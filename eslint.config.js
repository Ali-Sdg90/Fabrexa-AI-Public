export default [
    {
        ignores: ["node_modules/**", "legacy/**", "chat_memory/**"],
    },
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: 2024,
            sourceType: "module",
            globals: {
                AbortSignal: "readonly",
                Buffer: "readonly",
                console: "readonly",
                fetch: "readonly",
                process: "readonly",
                setTimeout: "readonly",
                clearTimeout: "readonly",
            },
        },
        rules: {
            "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
        },
    },
];
