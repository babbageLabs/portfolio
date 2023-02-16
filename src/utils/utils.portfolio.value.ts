import {Transform, TransformCallback} from 'stream';
import {
	apiConfig,
	apiResponse,
	KV,
	Token,
	TokenValue,
	transactionType,
} from './utils.types';
import fetch from 'node-fetch';
import {SingleBar} from 'cli-progress';
import * as colors from 'ansi-colors';
// import * as throttledQueue from 'throttled-queue';

// const cliProgress = require('cli-progress');
// const colors = require('ansi-colors');

class PortfolioValue extends Transform {
	private readonly summary: KV;
	private readonly priceCache: {[key: string]: TokenValue};
	private apiConfig: apiConfig;

	private readonly fetch: any = fetch;

	private bar: SingleBar;
	private countTotal = 0;
	private countCompleted = 0;
	private startTime: number;

	// private throttle: Function;

	private jobQueue: Promise<any>[];
	constructor(api: apiConfig, apiFetch: any = fetch) {
		super({
			readableObjectMode: true,
		});

		this.summary = {};
		this.priceCache = {};
		this.jobQueue = [];
		this.apiConfig = api;
		this.fetch = apiFetch;
		this.countTotal = 0;
		this.countCompleted = 0;
		this.startTime = new Date().getTime();
		this.bar = new SingleBar({
			format:
				colors.cyan('{bar}') +
				'| {percentage}% || {value}/{total} records || Speed: {speed}',
			barCompleteChar: '\u2588',
			barIncompleteChar: '\u2591',
			hideCursor: true,
		});
		this.bar.start(0, 0);
		// this.throttle = throttledQueue(10, 1000, true);
	}

	_transform(chunk: string, encoding: BufferEncoding, next: TransformCallback) {
		this.countTotal++;
		this.bar.setTotal(this.countTotal);
		this.jobQueue.push(this.computeSummary(JSON.parse(chunk)));
		next();
	}

	_flush(next: TransformCallback) {
		Promise.all(this.jobQueue).then(() => {
			this.bar.stop();
			return next(null, JSON.stringify(this.summary));
		});
	}

	updateProgress() {
		this.countCompleted++;
		let timeTaken = Math.abs(new Date().getTime() - this.startTime) / 1000;
		timeTaken = Math.ceil(timeTaken);
		this.bar.update(this.countCompleted, {
			speed: `${Math.abs((this.countCompleted * 60) / timeTaken)} records/s`,
		});
	}

	async computeSummary(token: Token): Promise<KV> {
		if (!this.summary[token.token]) {
			this.summary[token.token] = 0;
		}

		return this.getTokenValue(token).then(value => {
			if (token.transaction_type === transactionType.DEPOSIT) {
				this.summary[token.token] += value;
			} else if (token.transaction_type === transactionType.WITHDRAWAL) {
				this.summary[token.token] -= value;
			} else {
				throw new Error('Invalid transaction type');
			}
			this.updateProgress();

			return this.summary;
		});
	}

	async getTokenValue(value: Token): Promise<number> {
		if (!this.priceCache[this.getCacheKey(value)]) {
			const price = await this.getPrices(value);
			this.updatePriceCache(value, price);
		}
		return (
			parseFloat(String(this.priceCache[this.getCacheKey(value)].price)) *
			parseFloat(String(value.amount))
		);
	}

	getCacheKey(value: Token): string {
		return `${value.token}-${value.timestamp}`;
	}

	async getPrices(value: Token): Promise<apiResponse> {
		const response = await this.fetch(this.getApiUrl(value), {
			headers: {
				authorization: `Apikey ${this.apiConfig.apiKey}`,
			},
		});
		return response.json();
	}

	updatePriceCache(value: Token, data: apiResponse): void {
		this.priceCache[this.getCacheKey(value)] = {
			token: value.token,
			price: data[value.token][this.apiConfig.currency],
			timestamp: value.timestamp,
		};
	}

	getApiUrl(value: Token): string {
		return `https://min-api.cryptocompare.com/data/pricehistorical?fsym=${value.token}&tsyms=${this.apiConfig.currency}&ts=${value.timestamp}`;
	}
}

export default PortfolioValue;
