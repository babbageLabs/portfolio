import {Option} from 'commander';

const date = new Option(
  '-d, --date <token>',
  'return the portfolio value per token in USD on the given date'
);

export default date;
