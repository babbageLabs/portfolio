import {test, getDataStream} from './baseFixtures';
import FilterData from '../src/utils/utils.portfolio.filter';
import PortfolioValue from '../src/utils/utils.portfolio.value';

test.describe('Portfolio Value', async () => {
  test('should return the value of the portfolio', async () => {
    const params = {
      token: 'XRP',
      file: 'test.csv',
      apiKey: '123456789',
      currency: 'USD',
    };

    const portfolioValue = new PortfolioValue(params);

    const summarry = (await new Promise((resolve, reject) => {
      getDataStream()
        .pipe(new FilterData(params))
        .pipe(portfolioValue)
        .on('data', resolve)
        .on('error', reject);
    })) as {XRP: number};

    console.log(summarry);
    // expect(summarry.XRP).toBe(0.10514024999999999);
  });
});
