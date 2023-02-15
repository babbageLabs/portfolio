import {test, getDataStream, expect} from './baseFixtures';
import FilterData from '../src/utils/utils.portfolio.filter';
import PortfolioValue from '../src/utils/utils.portfolio.value';
import fetchMock from 'fetch-mock';

test.describe('Portfolio Value', async () => {
	const mock = fetchMock.sandbox().mock('*', {
		XRP: {
			USD: 10,
		},
	});

	test('should return the value of the portfolio', async () => {
		const params = {
			token: 'XRP',
			file: 'test.csv',
			apiKey: '123456789',
			currency: 'USD',
		};

		const portfolioValue = new PortfolioValue(params, mock);

		const summary = (await new Promise((resolve, reject) => {
			getDataStream()
				.pipe(new FilterData(params))
				.pipe(portfolioValue)
				.on('data', resolve)
				.on('error', reject);
		}).catch(e => {
			console.log(e);
		})) as string;
		const response: {[key: string]: number} = JSON.parse(summary);

		expect(mock.called('*')).toBe(true);
		expect(Math.round(response['XRP'])).toBe(
			Math.round(
				(parseFloat('0.650535') - parseFloat('0.29866')) * parseFloat('10')
			)
		);
	});
});
