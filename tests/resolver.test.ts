import { resolveEnvVariables } from '../src/resolver';
import type { ResolverProvider } from '../src/types';

describe('Resolver', () => {
	const provider: ResolverProvider = {
		resolve: async (key: string): Promise<string> => {
			return await new Promise((res) => res('resolved'));
		},
		shouldResolve: (value: string) => {
			return value.startsWith('remoteVar');
		},
	};

	process.env = {
		DB_PASSWORD: 'db_password',
		remoteVar: 'remoteVar-1',
		remoteVar2: 'remoteVar-2',
		remoteVar3: 'diff-3',
	};

	it('should resolve variables', async () => {
		await resolveEnvVariables(provider);

		expect(process.env.DB_PASSWORD).toBe('db_password');
		expect(process.env.remoteVar).toBe('resolved');
		expect(process.env.remoteVar2).toBe('resolved');
		expect(process.env.remoteVar3).toBe('diff-3');
	});
});
