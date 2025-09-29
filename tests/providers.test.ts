import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';
import { SSMProvider } from '../src/providers/ssm';
import { mockClient } from 'aws-sdk-client-mock';

const ssmMock = mockClient(SSMClient);

describe('SSMProvider', () => {
	let provider: SSMProvider;

	const params = {
		'/my/secure/db-password': 'db-password',
		'/my/secure/app-password': 'supersecret',
	};

	beforeAll(() => {
		process.env = {
			DB_PASSWORD: 'ssm:/my/secure/db-password',
			APP_PASSWORD: 'ssm:/my/secure/app-password',
			WRONG_SSM_VAR: 'asdasd',
		};

		provider = new SSMProvider();
	});

	beforeEach(() => {
		ssmMock.reset();

		// Setup smart mock that checks params object
		ssmMock.on(GetParameterCommand).callsFake((input) => {
			const paramName = input.Name;

			if (params[paramName as keyof typeof params]) {
				return {
					Parameter: {
						Value: params[paramName as keyof typeof params],
					},
				};
			}

			// Throw error if parameter doesn't exist in params
			throw {
				name: 'ParameterNotFound',
				message: `Parameter ${paramName} not found`,
				$metadata: {},
			};
		});
	});

	it('shouldResolve should return true if the value starts with ssm:', () => {
		expect(provider.shouldResolve(process.env.DB_PASSWORD!)).toBe(true);
	});

	it('shouldResolve should return false if the value does not start with ssm:', () => {
		expect(provider.shouldResolve(process.env.WRONG_SSM_VAR!)).toBe(false);
	});

	it('should resolve variables correctly when parameter exists', async () => {
		const result = await provider.resolve('DB_PASSWORD');

		expect(result).toBe(params['/my/secure/db-password']);
	});

	it('should throw error if SSM parameter does not exist in params', async () => {
		await expect(provider.resolve('WRONG_SSM_VAR')).rejects.toThrow();
	});

	it('should throw error if passing key that doesnt exist in env', async () => {
		await expect(provider.resolve('RANDOM_VAR')).rejects.toThrow();

		// Verify SSM was not called for non-existent env var
		expect(ssmMock.calls()).toHaveLength(0);
	});
});
