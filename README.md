# TRACE Evaluation Anaylsis
### Spilling the TEA

TEA is a tool to help analyze ApplyWeb's TRACE reviews.

## Workflow

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
yarn build
yarn start
```

### Environment variables or `config.toml`

TEA will accept either a username and password passed as `TEA_USERNAME` and `TEA_PASSWORD` as environment variables or as `username` and `password` fields in `config.toml`. If you choose to use the `.toml` file, you must either create the config yourself or try running the program once without the aforementioned environment variables. It will create the config file for you. Either way, one of the two must be present for this to work.
