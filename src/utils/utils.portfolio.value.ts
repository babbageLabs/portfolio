import {Transform, TransformCallback} from 'stream';
import {
	apiConfig,
	apiResponse,
	Token,
	TokenValue,
	transactionType,
} from './utils.types';
import fetch from 'node-fetch';

class PortfolioValue extends Transform {
	private readonly summary: {[key: string]: number};
	private readonly priceCache: {[key: string]: TokenValue};
	private apiConfig: apiConfig;

	private readonly fetch: any = fetch;

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
	}

	_transform(chunk: string, encoding: BufferEncoding, next: TransformCallback) {
		this.jobQueue.push(this.computeSummary(JSON.parse(chunk)));
		next();
	}

	_flush(next: TransformCallback) {
		Promise.all(this.jobQueue).then(() => {
			return next(null, JSON.stringify(this.summary));
		});
	}

	async computeSummary(token: Token): Promise<void> {
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
		});
	}

	async getTokenValue(value: Token): Promise<number> {
		if (!this.priceCache[this.getCacheKey(value)]) {
			const price = await this.getPrices(value);
			console.log('Fetching prices for', value.token, value.timestamp, price);
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
