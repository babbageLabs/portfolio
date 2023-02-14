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

  private jobQueue: Promise<any>[];
  constructor(api: apiConfig) {
    super({
      readableObjectMode: true,
    });

    this.summary = {};
    this.priceCache = {};
    this.jobQueue = [];
    this.apiConfig = api;
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
      await this.getPrices(value);
    }
    return this.priceCache[this.getCacheKey(value)].price * value.amount;
  }

  getCacheKey(value: Token): string {
    return `${value.token}-${value.timestamp}`;
  }

  async getPrices(value: Token): Promise<void> {
    const response = await fetch(this.getApiUrl(value), {
      headers: {
        authorization: `Apikey ${this.apiConfig.apiKey}`,
      },
    }).catch(err => {
      throw new Error(err);
    });
    const data: apiResponse = await response.json();

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
