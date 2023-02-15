import {expect, test, getDataStream} from './baseFixtures';
import FilterData from '../src/utils/utils.portfolio.filter';
import {Token} from '../src/utils/utils.types';
import {Readable, Transform, TransformCallback} from 'stream';
import {CMDParams} from '../src/utils/utils.types';

test.describe('FilterData Transformer', async () => {
	class ToArray extends Transform {
		private tokens: Token[];
		constructor() {
			super({
				readableObjectMode: true,
				writableObjectMode: true,
				objectMode: true,
			});

			this.tokens = [];
		}
		_transform(
			chunk: Token,
			encoding: BufferEncoding,
			callback: TransformCallback
		) {
			this.tokens.push(chunk);
			callback();
		}

		_flush(callback: TransformCallback) {
			return callback(null, this.tokens);
		}
	}

	async function readableToArray(readable: Readable, params: CMDParams) {
		return new Promise((resolve, reject) => {
			readable
				.pipe(new FilterData(params))
				.pipe(new ToArray())
				.on('data', resolve)
				.on('error', reject);
		});
	}

	test('should return valid BTC records only', async () => {
		const tokens = (await readableToArray(getDataStream(), {
			token: 'BTC',
			file: 'test.csv',
			apiKey: '123456789',
			currency: 'USD',
		})) as Token[];

		expect(tokens.length).toBe(3);
	});

	test('should return valid XRP records only', async () => {
		const tokens = (await readableToArray(getDataStream(), {
			token: 'XRP',
			file: 'test.csv',
			apiKey: '123456789',
			currency: 'USD',
		})) as Token[];

		expect(tokens.length).toBe(2);
	});

	// test('should return portfolio at time stamp 1571967208 records only', async ({
	//   page,
	// }) => {
	//   const tokens = (await readableToArray(getDataStream(), {
	//     file: 'test.csv',
	//     apiKey: '123456789',
	//     currency: 'USD',
	//     date: 1571967208,
	//   })) as Token[];
	//
	//   expect(tokens.length).toBe(2);
	// });
});
