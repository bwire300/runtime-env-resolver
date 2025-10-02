export interface ResolverProvider {
	/**
	 *
	 * @param value The env variable value to check if it should resolved or not
	 * @description This function will be called with each env variable value to check if it should be resolved or not
	 */
	shouldResolve(value: string): boolean;
	/**
	 *
	 * @param values The array of variable values to resolve
	 * @returns the resolved values in the same order
	 */
	resolve(values: string[]): Promise<string[]>;
}

export interface ResolveEnvOptions {
	/**
	 * enable/disable logging. Defaults to `true`
	 */
	logging?: boolean;
}
