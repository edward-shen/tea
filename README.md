# TRACE Evaluation Anaylsis

_With the rollout of 2FA, this repository no longer works, as the scraper is unable to function. There is no intent to resolve this issue, and this repo is no longer maintained. Please feel free to use this repo as reference or make an PR to fix this._

### Spilling the TEA

TEA is a tool to help analyze ApplyWeb's TRACE reviews.

## Background

Currently, TRACE reviews are authenticated via SAML. To access reviews, we need to first authenticate our application against the university's SAML. After we have authenticated our application, we start looking at how many reports we need to fetch. TEA caches the metadata after we fetch it, so we don't hit ApplyWeb's endpoint every time we run this. If the cache doesn't have as many reports as live data, we'll fetch as many as we need. (Currently brokenish).

## Configuration

### Prerequisites

This requires the following:
- Node (tested on v10.13.0, YMMV with older versions)
- MongoDB (tested on v4.0.4, YMMV with older versions)

Please refer to your package distributor for help on getting these installed. These must also be in your path.

### Installation

As of writing this readme, this software uses the latest Node v10 version. If you have `nvm` installed, you may simply run
```bash
nvm use
```
to use the correct node version. If you don't have the specified node version, please install it.

Then like all other Node setups,
```bash
yarn install
```

### Environment variables or `config.toml`

TEA will accept either a username and password passed as `TEA_USERNAME` and `TEA_PASSWORD` as environment variables or as `username` and `password` fields in `config.toml`. You must either create the config yourself (e.g. `cp exmaple_config.toml config.toml`) or try [running the scraper](#running-the-webscraper) once without the aforementioned environment variables. It will create the config file for you.

`config.toml` has been filled out with some defaults. If both the environment variables for the username and password exist, then TEA will prioritize environment variables.


## Running TEA locally

TEA is a complex system, and will require multiple stages for it to run.
The following articles are in-order to ultimately get the webserver running.

### Running the webscraper
The following task must be completed:
 - [Installation](#installation)

Simply build and run the webscraper:
```bash
yarn build:scraper
yarn start:scraper
```

Note that it is kinda hacky and requires a good internet connection. It should run successfully without requiring you to restart it. I've provided some progress bars to help show progress, but it still can take up to an hour.

### Running the database
The following task must be completed:
 - [Running the webscraper](#running-the-webscraper)

```bash
yarn start:db
```

This process starts a mongoDB server, using the `cache` directory as the location of the mongoDB data.

### Running express
The following task must be completed:
 - [Running the database](#running-the-database)

```bash
yarn start:webserver
```

Express is the backend used to serve data from mongoDB. It acts as a middleman to prevent front end users from directly communicating with the mongodb server.

### Running the development webserver
The most common task is to start a local webserver for development.

To do so, the following tasks must be completed:
 - [Running the database](#running-the-database)
 - [Running express](#running-express)

Both tasks must be running while the webserver is being run.

```bash
yarn start:server
```

## Running TEA for production

Please don't.
