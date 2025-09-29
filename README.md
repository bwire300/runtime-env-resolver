# remote-env-resolver

## Overview

This package provides a flexible environment variable resolver with pattern matching and custom resolution strategies.  
It supports resolving variables from AWS Systems Manager (SSM) Parameter Store and other custom providers.

## Install

```bash
npm install remote-env-resolver
```


## Usage

### Example 1: Using the SSM Provider

(Requires `@aws-sdk/client-ssm` to be installed)

```typescript
import { resolveEnvVariables, SSMProvider } from 'remote-env-resolver';

await resolveEnvVariables(new SSMProvider());
```

---

### Example 2: Using a Custom Provider

```typescript
import { resolveEnvVariables } from 'remote-env-resolver';

await resolveEnvVariables({
	shouldResolve: (value) => value.startsWith('custom:'),
	resolve: async (key) => {
		// Implement custom resolution logic here
		return 'resolved-value';
	},
});
```

---

## Contributing

We welcome contributions from the community. If you find a bug or have a feature request, please open an issue.
If you'd like to contribute code, open a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for more information.

## Resources

- NPM: [https://www.npmjs.com/package/remote-env-resolver](https://www.npmjs.com/package/remote-env-resolver)
- GitHub: [https://github.com/Maged-Zaki/remote-env-resolver](https://github.com/Maged-Zaki/remote-env-resolver)