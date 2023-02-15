import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import {test as baseTest} from '@playwright/test';
import {Readable} from 'stream';
import {stringify} from 'csv-stringify';
import {parse} from 'csv-parse';

const istanbulCLIOutput = path.join(process.cwd(), '.nyc_output');

export function generateUUID(): string {
	return crypto.randomBytes(16).toString('hex');
}

export const test = baseTest.extend({
	context: async ({context}, use) => {
		await context.addInitScript(() =>
			window.addEventListener('beforeunload', () =>
				(window as any).collectIstanbulCoverage(
					JSON.stringify((window as any).__coverage__)
				)
			)
		);
		// eslint-disable-next-line
		await fs.promises.mkdir(istanbulCLIOutput, {recursive: true});
		await context.exposeFunction(
			'collectIstanbulCoverage',
			(coverageJSON: string) => {
				if (coverageJSON)
					fs.writeFileSync(
						path.join(
							istanbulCLIOutput,
							`playwright_coverage_${generateUUID()}.json`
						),
						coverageJSON
					);
			}
		);
		await use(context);
		for (const page of context.pages()) {
			await page.evaluate(() =>
				(window as any).collectIstanbulCoverage(
					JSON.stringify((window as any).__coverage__)
				)
			);
		}
	},
});

export const getDataStream = (): Readable => {
	return stringify(
		[
			[1571967208, 'DEPOSIT', 'BTC', '0.298660'],
			[1571967208, 'DEPOSIT', 'ETH', '0.298660'],
			[1571967200, 'WITHDRAWAL', 'BTC', '0.683640'],
			[1571967189, 'WITHDRAWAL', 'ETH', '0.493839'],
			[1571967150, 'DEPOSIT', 'BTC', '0.298660'],
			[1571966868, 'WITHDRAWAL', 'XRP', '0.298660'],
			[1571966869, 'DEPOSIT', 'XRP', '0.650535'],
		],
		{
			header: true,
			columns: ['timestamp', 'transaction_type', 'token', 'amount'],
			// objectMode: true,
		}
	).pipe(
		parse({
			columns: true,
			encoding: 'utf8',
		})
	);
};

export const expect = test.expect;
