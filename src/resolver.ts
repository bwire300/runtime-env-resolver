import type { ResolveEnvOptions, ResolverProvider } from './types.js';

/**
 * Resolve environment variables using the given provider.
 *
 * The function will loop through all environment variables and
 * check if the value should be resolved using the provider.
 * If the value should be resolved, the function will call the
 * provider's resolve method and set the resolved value as the
 * environment variable.
 *
 * @param provider The resolver provider to use for resolving
 *        environment variables.
 * @param options Optional settings for the resolver
 */
export async function resolveEnvVariables(provider: ResolverProvider, options: ResolveEnvOptions = {}) {
	const { logging = true } = options;

	const resolvable: { keys: string[]; values: string[] } = {
		keys: [],
		values: [],
	};

	for (const key of Object.keys(process.env)) {
		const value = process.env[key];

		if (!value || !provider.shouldResolve(value)) {
			continue;
		}

		resolvable.keys.push(key);
		resolvable.values.push(value);
	}

	const resolvedVars = await provider.resolve(resolvable.values);

	for (let i = 0; i < resolvable.keys.length; i++) {
		process.env[resolvable.keys[i]] = resolvedVars[i];
	}

	if (logging) {
		if (resolvedVars.length > 0) {
			console.log(`Resolved ${resolvedVars.length} environment variable(s): ${resolvedVars.join(', ')}`);
		} else {
			console.log('No environment variables needed resolution.');
		}
	}
}
