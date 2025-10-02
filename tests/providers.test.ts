import { SSMClient, GetParametersCommand } from '@aws-sdk/client-ssm';
import { SSMProvider } from '../src/providers/ssm';
import { mockClient } from 'aws-sdk-client-mock';

const ssmMock = mockClient(SSMClient);

describe('SSMProvider', () => {
	let provider: SSMProvider;

	const params = {
		'/my/secure/db-password': 'db-password',
		'/my/secure/app-password': 'supersecret',
		'/my/secure/api-key': 'apikey123',
		'/my/secure/jwt-secret': 'jwtSecret!@#',
		'/my/secure/redis-pass': 'redisPass456',
		'/my/secure/mq-token': 'mqToken789',
		'/my/secure/ssh-key': 'sshKeyPrivate',
		'/my/secure/email-pass': 'emailPass321',
		'/my/secure/storage-key': 'storageKeyABC',
		'/my/secure/stripe-secret': 'stripeSecretXYZ',
		'/my/secure/webhook-token': 'webhookToken555',
		'/my/secure/admin-pass': 'adminPass999',
		'/my/secure/analytics-key': 'analyticsKey777',
		'/my/secure/session-secret': 'sessionSecret!2025',
	};

	const getResolvableValues = () => {
		return Object.values(process.env)
			.map((value) => value || '') // replace undefined with ''
			.filter((value) => provider.shouldResolve(value));
	};

	beforeAll(() => {
		process.env = {
			DB_PASSWORD: 'ssm:/my/secure/db-password',
			APP_PASSWORD: 'ssm:/my/secure/app-password',
			API_KEY: 'ssm:/my/secure/api-key',
			JWT_SECRET: 'ssm:/my/secure/jwt-secret',
			REDIS_PASS: 'ssm:/my/secure/redis-pass',
			MQ_TOKEN: 'ssm:/my/secure/mq-token',
			SSH_KEY: 'ssm:/my/secure/ssh-key',
			EMAIL_PASS: 'ssm:/my/secure/email-pass',
			STORAGE_KEY: 'ssm:/my/secure/storage-key',
			STRIPE_SECRET: 'ssm:/my/secure/stripe-secret',
			WEBHOOK_TOKEN: 'ssm:/my/secure/webhook-token',
			ADMIN_PASS: 'ssm:/my/secure/admin-pass',
			ANALYTICS_KEY: 'ssm:/my/secure/analytics-key',
			SESSION_SECRET: 'ssm:/my/secure/session-secret',

			// non-SSM env var to ensure it doesn't get modified/resolved
			NON_SSM_VAR: 'asdasd',
		};

		provider = new SSMProvider();
	});

	beforeEach(() => {
		ssmMock.reset();

		// Support GetParametersCommand (multiple params fetch)
		ssmMock.on(GetParametersCommand).callsFake((input) => {
			const found: any[] = [];
			const invalid: string[] = [];

			for (const name of input.Names ?? []) {
				const value = params[name as keyof typeof params];

				if (value) {
					found.push({
						Name: name,
						Value: value,
					});
				} else {
					invalid.push(name);
				}
			}

			return {
				Parameters: found,
				InvalidParameters: invalid,
			};
		});
	});

	it('shouldResolve should return true if the value starts with ssm:', () => {
		expect(provider.shouldResolve(process.env.DB_PASSWORD!)).toBe(true);
	});

	it('shouldResolve should return false if the value does not start with ssm:', () => {
		expect(provider.shouldResolve(process.env.NON_SSM_VAR!)).toBe(false);
	});

	it('should resolve variables correctly and preserve order', async () => {
		const result = await provider.resolve(getResolvableValues());

		// order must be preserved
		expect(result).toEqual([
			params['/my/secure/db-password'],
			params['/my/secure/app-password'],
			params['/my/secure/api-key'],
			params['/my/secure/jwt-secret'],
			params['/my/secure/redis-pass'],
			params['/my/secure/mq-token'],
			params['/my/secure/ssh-key'],
			params['/my/secure/email-pass'],
			params['/my/secure/storage-key'],
			params['/my/secure/stripe-secret'],
			params['/my/secure/webhook-token'],
			params['/my/secure/admin-pass'],
			params['/my/secure/analytics-key'],
			params['/my/secure/session-secret'],
		]);
	});

	it('should throw error if SSM parameter does not exist', async () => {
		await expect(provider.resolve(['ssm:/my/secure/does-not-exist'])).rejects.toThrow();

		// Add invalid parameter
		process.env['ssm:/my/secure/hana-pass'] = 'ssm:/my/secure/hana-pass';

		await expect(provider.resolve(getResolvableValues())).rejects.toThrow();
	});
});
