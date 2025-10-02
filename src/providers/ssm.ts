import { GetParametersCommand, SSMClient, SSMClientConfig } from '@aws-sdk/client-ssm';
import type { ResolverProvider } from '../types.js';

/**
 * A provider that resolves environment variables
 * from **AWS Systems Manager (SSM) Parameter Store**, prefixed with `ssm:`.
 *
 * Usage:
 * - install `@aws-sdk/client-ssm`
 * - Prefix variables with `ssm:` in your environment (e.g., `ssm:/my/secure/password`).
 */
export class SSMProvider implements ResolverProvider {
	private prefix: string = 'ssm:';
	private ssmClient: SSMClient;
	private maxParamsPerRequest: number = 10;

	constructor(inputConfig?: SSMClientConfig) {
		this.ssmClient = new SSMClient(inputConfig || {});
	}

	shouldResolve(value: string) {
		return value.startsWith(this.prefix);
	}
	async resolve(values: string[]): Promise<string[]> {
		const params = values.map((v) => v.replace(this.prefix, ''));

		const resolvedValues: string[] = [];

		for (let i = 0; i < params.length; i += this.maxParamsPerRequest) {
			const batch = params.slice(i, i + this.maxParamsPerRequest);

			const response = await this.ssmClient.send(
				new GetParametersCommand({
					Names: batch,
					WithDecryption: true,
				})
			);

			if (response.InvalidParameters?.length) {
				throw new Error(`Invalid parameters: ${response.InvalidParameters.join(', ')}`);
			}

			// Sort params by name
			const paramMap = new Map(response.Parameters?.map((p) => [p.Name!, p.Value!]));

			for (const param of batch) {
				const value = paramMap.get(param);

				if (!value) {
					throw new Error(`Parameter ${param} not found, but should be!`);
				}

				resolvedValues.push(value);
			}
		}

		return resolvedValues;
	}
}
