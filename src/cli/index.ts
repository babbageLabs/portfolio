import {Command} from 'commander';
import date from './cli.token.option';
import token from './cli.date.option';

const portfolio = new Command();

portfolio
  .name('portfolio')
  .description('CLI to get your portfolio value')
  .version('1.0.0')
  .action(() => {
    console.log('return the latest portfolio value per token in USD');
  })
  .addOption(token)
  .addOption(date);

export default portfolio;
