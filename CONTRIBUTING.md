# Contributing to QueryForge

First off, thank you for considering contributing to QueryForge! It's people like you that make QueryForge such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* Use a clear and descriptive title
* Describe the exact steps which reproduce the problem
* Provide specific examples to demonstrate the steps
* Describe the behavior you observed after following the steps
* Explain which behavior you expected to see instead and why
* Include code samples and stack traces if applicable

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* Use a clear and descriptive title
* Provide a step-by-step description of the suggested enhancement
* Provide specific examples to demonstrate the steps
* Describe the current behavior and explain which behavior you expected to see instead
* Explain why this enhancement would be useful

### Pull Requests

* Fork the repo and create your branch from `main`
* If you've added code that should be tested, add tests
* If you've changed APIs, update the documentation
* Ensure the test suite passes
* Make sure your code lints
* Issue that pull request!

## Development Setup

1. Fork and clone the repo
2. Run `npm install` to install dependencies
3. Create a branch for your changes
4. Make your changes
5. Run tests with `npm test`
6. Push to your fork and submit a pull request

### Project Structure

```
queryforge/
├── src/                    # Source files
│   ├── connections/        # Database connection managers
│   ├── __tests__/         # Tests
│   ├── interfaces.ts      # TypeScript interfaces
│   ├── types.ts           # TypeScript types
│   ├── QueryBuilder.ts    # Base query builder
│   └── QueryForge.ts      # Main query builder
├── examples/              # Example usage
├── docs/                 # Documentation
└── package.json
```

### Coding Style

* Use TypeScript
* Follow the existing coding style
* Run `npm run lint` to check your code
* Run `npm run format` to format your code

## License

By contributing, you agree that your contributions will be licensed under its MIT License. 