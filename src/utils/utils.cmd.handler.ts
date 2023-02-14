import * as fs from 'fs';
import {parse} from 'csv-parse';
import {CMDParams} from './utils.types';
import FilterData from './utils.portfolio.filter';
import PortfolioValue from './utils.portfolio.value';
import * as stream from 'stream';

export const getFileStream = (path: string): fs.ReadStream => {
  const readerStream = fs.createReadStream(path);
  readerStream.setEncoding('utf8');

  return readerStream;
};

const portfolioHandler = async (
  dataStream: stream.Readable,
  params: CMDParams
): Promise<void> => {
  const parser = parse({
    delimiter: ',',
    columns: true,
  });

  dataStream
    .pipe(parser)
    .pipe(new FilterData(params))
    .pipe(new PortfolioValue(params))
    .on('data', (chunk: any) => {
      console.log(chunk);
    });

  dataStream.on('error', err => {
    console.error(err);
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
