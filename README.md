# remote-env-resolver

## Overview

This package provides a flexible environment variable resolver with pattern matching and custom resolution strategies.  
It scans your `process.env` variables, detects values that match a provider’s prefix or pattern (e.g. `ssm:`), resolves them (e.g. fetching from AWS SSM), and replaces them with the resolved values.

This way, you can keep placeholders like `ssm:/my/db/password` in your environment files and let the resolver fetch the actual secrets at runtime.

## Install

```bash
npm install remote-env-resolver
```

## Usage

### Example 1: Using a built-in Provider (SSMProvider)

(Requires `@aws-sdk/client-ssm` to be installed)

This provider resolves any environment variable that starts with `ssm:` by fetching the corresponding parameter from **AWS Systems Manager Parameter Store**.

```typescript
import { resolveEnvVariables, SSMProvider } from 'remote-env-resolver';

// Default usage (works automatically on AWS services such as EC2 or Lambda
// when an IAM role with SSM permissions is attached)
await resolveEnvVariables(new SSMProvider());

// Custom configuration (needed if running locally or outside AWS)
await resolveEnvVariables(
	new SSMProvider({
		credentials: {
			accessKeyId: '<key>',
			secretAccessKey: '<secret>',
		},
		region: '<region>',
	})
);
```

#### Example workflow

**Before resolution (`process.env`):**

```env
DB_PASSWORD=ssm:/myapp/db/password
```

**After resolution (`process.env`):**

```env
DB_PASSWORD=super-secure-password-from-ssm
```
---

### Example 2: Using a Custom Provider

```typescript
import { resolveEnvVariables } from './resolver.js';
import { ResolverProvider } from './types.js';

/**
 * This demonstrates how to create your own provider for handling
 * environment variables with a specific prefix (e.g. `custom:`).
 *
 * In this case, variables like:
 *   DB_PASSWORD=custom:db-passswrd-123
 *
 * will be intercepted by the custom provider, transformed, and resolved
 * into their final values.
 */
const customProvider: ResolverProvider = {
	/**
	 * Determines whether the provider should handle the given value.
	 * Here, we only resolve values starting with `custom:`.
	 */
	shouldResolve(value: string) {
		return value.startsWith('custom:');
	},

	/**
	 * Defines how to resolve the matched value.
	 * This could be replaced with calls to external APIs,
	 * decryption logic, or database lookups.
	 */
	async resolve(value: string) {
		const valueWithoutPrefix = value.replace('custom:', '');

		// Replace this with real resolution logic
		const resolvedValue = valueWithoutPrefix;

		return resolvedValue;
	},
};

await resolveEnvVariables(customProvider);
````

---

## Contributing

We welcome contributions from the community. If you find a bug or have a feature request, please open an issue.
If you'd like to contribute code, open a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for more information.

## Resources

- NPM: [https://www.npmjs.com/package/remote-env-resolver](https://www.npmjs.com/package/remote-env-resolver)
- GitHub: [https://github.com/Maged-Zaki/remote-env-resolver](https://github.com/Maged-Zaki/remote-env-resolver)
