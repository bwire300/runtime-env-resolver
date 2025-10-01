export interface ResolverProvider {
	/**
	 *
	 * @param value The env variable value to check if it should resolved or not
	 * @description This function will be called with each env variable value to check if it should be resolved or not
	 */
	shouldResolve(value: string): boolean;
	/**
	 *
	 * @param value The env variable value to resolve it
	 * @description Returns the resolved value
	 */
	resolve(value: string): Promise<string>;
}

export interface ResolveEnvOptions {
	logging?: boolean; // enable/disable logging
}
