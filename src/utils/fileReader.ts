import * as fs from 'fs';

const readData = async (filePath: string): Promise<void> => {
  const readerStream = fs.createReadStream(filePath);
  readerStream.setEncoding('utf8');

  readerStream.on('data', chunk => {
    console.log(chunk);
  });

  readerStream.on('end', () => {
    console.log(
      '-------------------end of file reader -------------------------------------------------'
    );
  });

  readerStream.on('error', err => {
    console.log(err.stack);
  });
};

export {readData};
