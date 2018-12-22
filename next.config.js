
const withSass = require('@zeit/next-sass');
const withTS = require('@zeit/next-typescript');

module.exports = withTS(withSass());
