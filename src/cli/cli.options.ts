import {Option} from 'commander';

const token = new Option(
  '-t, --token <token>',
  'return the latest portfolio value for the token in USD'
);

const file = new Option(
  '-f, --file <file>',
  'the file containing the portfolio data'
).default(
  process.env.PORTFOLIO_DATA || './data/sample.csv',
  'uses the data file from the environment variables PORTFOLIO_DATA'
);

const date = new Option(
  '-d, --date <date>',
  'return the portfolio value per token in USD on the given date'
);

const apiKey = new Option(
  '-k, --key <key>',
  'the API key to use to get the token prices'
).default(
  process.env.PORTFOLIO_API_KEY,
  'uses the default API key from the environment variables PORTFOLIO_API_KEY'
);

const currency = new Option(
  '-d, --currency <currency>',
  'the currency to use to get the token prices'
).default(
  process.env.PORTFOLIO_API_KEY,
  'uses the default API key from the environment variables PORTFOLIO_API_KEY'
);

export {token, date, file, apiKey, currency};
