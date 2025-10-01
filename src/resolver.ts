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
 * @param options Optional settings (logging).
 */
export async function resolveEnvVariables(provider: ResolverProvider, options: ResolveEnvOptions = {}) {
	const { logging = true } = options;

	const resolvedKeys = [];

	for (const key of Object.keys(process.env)) {
		const rawValue = process.env[key];
		if (!rawValue) continue;

		if (!provider.shouldResolve(rawValue)) continue;

		process.env[key] = await provider.resolve(rawValue);
		resolvedKeys.push(key);
	}

	if (logging) {
		if (resolvedKeys.length > 0) {
			console.log(`Resolved ${resolvedKeys.length} environment variable(s): ${resolvedKeys.join(', ')}`);
		} else {
			console.log('No environment variables needed resolution.');
		}
	}

	return resolvedKeys;
}
