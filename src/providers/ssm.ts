import { GetParameterCommand, SSMClient, SSMClientConfig } from '@aws-sdk/client-ssm';
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
	private ssmClient: SSMClient;
	private prefix: string = 'ssm:';

	constructor(inputConfig?: SSMClientConfig) {
		this.ssmClient = new SSMClient(inputConfig || {});
	}

	shouldResolve(value: string) {
		return value.startsWith(this.prefix);
	}
	async resolve(value: string): Promise<string> {
		const response = await this.ssmClient.send(
			new GetParameterCommand({
				Name: value.replace(this.prefix, ''),
				WithDecryption: true,
			})
		);

		return response.Parameter?.Value || '';
	}
}
