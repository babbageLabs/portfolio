import {test, expect, getDataStream} from './baseFixtures';
import portfolioHandler, {
  getAPICurrency,
  getAPiKey,
} from '../src/utils/utils.cmd.handler';

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
    await page.route(
      'https://min-api.cryptocompare.com/data/pricehistorical?**',
      async route => {
        const response = await route.fetch();
        const json = await response.json();
        json.message = {
          BTC: {
            USD: 100,
          },
        };
        await route.fulfill({response, json});
      }
    );

    await portfolioHandler(getDataStream(), {
      apiKey: '123456789',
      currency: 'USD',
      file: 'test.csv',
    });
  });
});
