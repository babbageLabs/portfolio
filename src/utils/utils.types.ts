enum transactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
}

type Token = {
  timestamp: number;
  transaction_type: transactionType;
  token: string;
  amount: number;
};

type TokenValue = {
  token: string;

  price: number;

  timestamp: number;
};

type CMDParams = {
  token?: string;
  date?: number;
  file: string;

  apiKey: string;
  currency: string;
};

type apiConfig = {
  apiKey: string;
  currency: string;
};

type apiResponse = {
  [key: string]: {
    [key: string]: number;
  };
};

export {Token, CMDParams, TokenValue, transactionType, apiConfig, apiResponse};
