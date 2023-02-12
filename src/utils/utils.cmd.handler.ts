import * as fs from 'fs';
import {parse} from 'csv-parse';
import {CMDParams} from './utils.types';
import FilterData from './utils.portfolio.filter';
import PortfolioValue from './utils.portfolio.value';

const portfolioHandler = async (params: CMDParams): Promise<void> => {
  const readerStream = fs.createReadStream(params.file);
  readerStream.setEncoding('utf8');
  const parser = parse({
    delimiter: ',',
    columns: true,
  });

  readerStream
    .pipe(parser)
    .pipe(new FilterData(params))
    .pipe(new PortfolioValue(params))
    .on('data', parsed => {
      console.log(parsed);
    });

  readerStream.on('end', (chunk: any) => {
    console.log(
      '-------------------end of file reader -------------------------------------------------'
    );
    console.log(chunk);
  });

  readerStream.on('error', err => {
    console.log(err.stack);
  });
};

export const getAPiKey = (): string => {
  if (process.env.PORTFOLIO_API_KEY) {
    return process.env.PORTFOLIO_API_KEY;
  }

  return '';
};
export const getAPICurrency = (): string => {
  if (process.env.PORTFOLIO_CURRENCY) {
    return process.env.PORTFOLIO_CURRENCY;
  }
  return 'USD';
};

export default portfolioHandler;
