export interface ResolverProvider {
	/**
	 *
	 * @param value The env variable value to check if it should resolved or not
	 * @description Returns true if the value should be resolved
	 */
	shouldResolve(value: string): boolean;
	/**
	 *
	 * @param key The env variable key to resolve
	 * @description Returns the resolved value
	 */
	resolve(key: string): Promise<string>;
}
