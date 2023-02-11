"use strict";
exports.__esModule = true;
var commander_1 = require("commander");
var cli_token_option_1 = require("./cli.token.option");
var cli_date_option_1 = require("./cli.date.option");
var portfolio = new commander_1.Command();
portfolio
    .name('portfolio')
    .description('CLI to get your portfolio value')
    .version('1.0.0')
    .action(function () {
    console.log('return the latest portfolio value per token in USD');
})
    .addOption(cli_date_option_1["default"])
    .addOption(cli_token_option_1["default"]);
exports["default"] = portfolio;
