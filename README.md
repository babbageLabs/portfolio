![build](https://github.com/babbageLabs/portfolio/badges/master/test-coverage.svg)
# My Portfolio

MyPortfolio is a CLI application used to compute the value of a portfolio given a set of
transaction records. The records can be provided in a CSV file that is assumed 
to have the following format:

    timestamp: Integer number of seconds since the Epoch
    transaction_type: Either a DEPOSIT or a WITHDRAWAL
    token: The token symbol
    amount: The amount transacted

# Pre-requisites
To run the application, you need to have Node.js installed [Set Up Guide](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm). 
After installing Node.js, you can install the application by running the following command:

    git clone https://github.com/babbageLabs/portfolio.git
    cd portfolio
    yarn install # or npm install
    touch .env # create the environment file
The application requires the following environment variables to be set:

    PORTFOLIO_DATA: The path to the CSV file containing the portfolio data
    PORTFOLIO_API_KEY: The API key to use to get the token prices
    PORTFOLIO_CURRENCY=USD # optional, the currency to use to get the token prices. defaults to USD

A sample of the Portfolio data can be obtained here: [Portfolio Data](https://s3-ap-southeast-1.amazonaws.com/static.propine.com/transactions.csv.zip)
To get the API key, you can register for a free account at [Crypto Compare](https://min-api.cryptocompare.com/)

# Usage
Given no parameters, we get the latest portfolio value per token in USD
Given a token, we get the latest portfolio value for that token in USD
Given a date, we get the portfolio value per token in USD on that date
Given a date and a token, we get the portfolio value of that token in USD on that date

    Usage: portfolio [options]

    CLI to get your portfolio value
    
    Options:
    -V, --version              output the version number
    -t, --token <token>        return the latest portfolio value for the token in USD
    -d, --date <date>          return the portfolio value per token in USD on the given date
    -f, --file <file>          the file containing the portfolio data (default: uses the data file from the environment variables PORTFOLIO_DATA)
    -k, --key <key>            the API key to use to get the token prices
    -d, --currency <currency>  the currency to use to get the token prices
    -h, --help                 display help for command

# Running the tests
To run the unit tests, run the following command:

    yarn test # or npm test

