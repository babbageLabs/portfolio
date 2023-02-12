import {expect, test} from '@playwright/test';
import {stringify} from 'csv-stringify';
import portfolioHandler, {
  getAPICurrency,
  getAPiKey,
} from '../src/utils/utils.cmd.handler';
import {apiResponse} from '../src/utils/utils.types';
test.describe('getAPiKey', () => {
  test.afterEach(() => {
    delete process.env.PORTFOLIO_API_KEY;
  });

  test('should return an empty string if environment is not set', () => {
    expect(getAPiKey()).toBe('');
  });

  test('should return the api key from environment variables', () => {
    process.env.PORTFOLIO_API_KEY = '123456789';
    expect(getAPiKey()).toBe('123456789');
  });
});

test.describe('getAPICurrency', () => {
  test.afterEach(() => {
    delete process.env.PORTFOLIO_CURRENCY;
  });

  test('should return an empty string if environment is not set', () => {
    expect(getAPICurrency()).toBe('USD');
  });

  test('should return the api key from environment variables', () => {
    process.env.PORTFOLIO_CURRENCY = 'EUR';
    expect(getAPICurrency()).toBe('EUR');
  });
});

test.describe('portfolioHandler', async () => {
  test('should return the portfolio value', async ({page}) => {
    await page.route('*', async route => {
      const requestUrl = route.request().url();
      console.log(3333333333333333333, requestUrl);
      const message: apiResponse = {
        BTC: {
          USD: 100,
        },
      };
      await route.fulfill({
        status: 200,
        body: JSON.stringify(message),
      });
    });

    const dataStream = stringify(
      [
        [1571967208, 'DEPOSIT', 'BTC', '0.298660'],
        [1571967208, 'DEPOSIT', 'ETH', '0.298660'],
        [1571967200, 'WITHDRAWAL', 'BTC', '0.683640'],
        [1571967189, 'WITHDRAWAL', 'ETH', '0.493839'],
        [1571967150, 'DEPOSIT', 'BTC', '0.298660'],
        [1571966868, 'WITHDRAWAL', 'XRP', '0.298660'],
        [1571966868, 'DEPOSIT', 'XRP', '0.650535'],
      ],
      {
        header: true,
        columns: ['timestamp', 'transaction_type', 'token', 'amount'],
      }
    );

    await portfolioHandler(dataStream, {
      apiKey: '123456789',
      currency: 'USD',
      file: 'test.csv',
    });
  });
});
