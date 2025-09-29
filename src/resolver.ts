import type { ResolverProvider } from './types.js';

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
 */
export async function resolveEnvVariables(provider: ResolverProvider) {
	const varKeys = Object.keys(process.env);

	for (const key of varKeys) {
		const rawValue = process.env[key];

		if (!rawValue) {
			continue;
		}

		if (!provider.shouldResolve(rawValue)) {
			continue;
		}

		process.env[key] = await provider.resolve(key);
	}
}
