import {Command} from 'commander';
import {apiKey, date, file, token, currency} from './cli/cli.options';
import {CMDParams} from './utils/utils.types';
import portfolioHandler, {
	getAPICurrency,
	getAPiKey,
	getFileStream,
} from './utils/utils.cmd.handler';
import * as dotenv from 'dotenv';

dotenv.config();
const portfolio = new Command();

portfolio
	.name('portfolio')
	.description('CLI to get your portfolio value')
	.version('1.0.0')
	.addOption(token)
	.addOption(date)
	.addOption(file)
	.addOption(apiKey)
	.addOption(currency)
	.action(async (args: CMDParams) => {
		args.apiKey = getAPiKey();
		args.currency = getAPICurrency();

		const dataStream = getFileStream(args.file);

		await portfolioHandler(dataStream, args);
	});

portfolio.parse();
