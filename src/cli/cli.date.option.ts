import {Option} from 'commander';

const token = new Option(
  '-t, --token <token>',
  'return the latest portfolio value for the token in USD'
);

export default token;
