import {Transform, TransformCallback} from 'stream';
import {CMDParams, Token} from './utils.types';

class FilterData extends Transform {
  private params: CMDParams;
  constructor(params: CMDParams) {
    super({
      readableObjectMode: true,
      writableObjectMode: true,
    });

    this.params = params;
  }
  _transform(chunk: Token, encoding: BufferEncoding, next: TransformCallback) {
    if (this.isValid(chunk)) {
      return next(null, chunk);
    }

    next();
  }

  isValid(value: Token) {
    return (
      this.isTokenValid(value) &&
      this.isDateValid(value) &&
      this.isTypeValid(value)
    );
  }

  isTokenValid(value: Token): boolean {
    if (this.params.token) {
      return value.token === this.params.token;
    }

    return true;
  }

  isDateValid(value: Token): boolean {
    if (this.params.date) {
      return value.timestamp === this.params.date;
    }

    return true;
  }

  isTypeValid(value: Token): boolean {
    return ['DEPOSIT', 'WITHDRAWAL'].includes(
      value.transaction_type.toUpperCase()
    );
  }
}

export default FilterData;
