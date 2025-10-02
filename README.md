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

/**
 *  Default (works automatically on AWS services such as EC2 or Lambda
 *  when an IAM role with SSM permissions exists).
 * 
 * 	Outside of AWS or running locally, pass credentials SSMProvider({ credentials, region })
 * **/
await resolveEnvVariables(new SSMProvider());
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

### Example 2: Using a Custom Provider (Your Own Provider)

```typescript
import { resolveEnvVariables, ResolverProvider } from 'remote-env-resolver';

// A simple provider that resolves values starting with `custom:`
const customProvider: ResolverProvider = {
	shouldResolve(value: string) {
		return value.startsWith('custom:');
	},
	async resolve(values: string[]) {
		const strippedValues = values.map((value) => value.replace('custom:', ''));
		// Your custom logic to resolve the value
		// Ensure to return the resolved values in the same order as the original values array

		return []
	},
};

await resolveEnvVariables(customProvider);
```

#### Example workflow

**Before resolution (`process.env`):**

```env
DB_PASSWORD=custom:db-password-123
```

**After resolution (`process.env`):**

```env
DB_PASSWORD=db-password-123
```

---

## Contributing

We welcome contributions from the community. If you find a bug or have a feature request, please open an issue.
If you'd like to contribute code, fork the repository and open a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for more information.

## Resources

- NPM: [https://www.npmjs.com/package/remote-env-resolver](https://www.npmjs.com/package/remote-env-resolver)
- GitHub: [https://github.com/Maged-Zaki/remote-env-resolver](https://github.com/Maged-Zaki/remote-env-resolver)
