# remote-env-resolver

## Overview

`remote-env-resolver` lets you **store environment variables as placeholders** (e.g. `ssm:/my/db/password`) and **resolve them at runtime** from different sources like AWS SSM or your own custom provider.

- **Built-in support**: AWS SSM Parameter Store (`ssm:` prefix)
- **Custom providers**: Write your own to resolve any placeholder format
- **Use cases**: secrets management, dynamic config, local + cloud friendly

---

## Install

```bash
npm install remote-env-resolver
```

---

## Usage

### 1. Built-in Provider (AWS SSM)

(Requires `@aws-sdk/client-ssm`)

```ts
import { resolveEnvVariables, SSMProvider } from 'remote-env-resolver';

// Works on AWS (Lambda, EC2) if IAM role has SSM permissions.
// For outside AWS: new SSMProvider({ region, credentials })
await resolveEnvVariables(new SSMProvider());
```

**Before** (`process.env`):

```env
DB_PASSWORD=ssm:/myapp/db/password
```

**After** (`process.env`):

```env
DB_PASSWORD=super-secure-password-from-ssm
```

---

### 2. Custom Provider

```ts
import { resolveEnvVariables } from 'remote-env-resolver';

await resolveEnvVariables({
	shouldResolve(value) {
		return value.startsWith('custom:');
	},
	async resolve(values) {
		// Strip prefix
		const noPrefix = values.map((v) => v.replace('custom:', ''));

		// apply your own logic
		// NOTE: ensure to preserve order of values in the same order as the original array
		return noPrefix;
	},
});
```

**Before** (`process.env`):

```env
DB_PASSWORD=custom:db-password-123
```

**After** (`process.env`):

```env
DB_PASSWORD=db-password-123
```

---

## Contributing

PRs and issues are welcome! Fork the repo and open a pull request.

## License

MIT License – see [LICENSE](./LICENSE).

## Resources

- **NPM:** https://www.npmjs.com/package/remote-env-resolver
- **GitHub:** https://github.com/Maged-Zaki/remote-env-resolver
