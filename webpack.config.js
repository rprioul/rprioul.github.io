const path = require('path');

const config = {
  entry: {
    index: path.resolve(__dirname, './projects/cryptodashboard/js/index.js'),
  },
  output: {
    path: path.resolve(__dirname, './projects/cryptodashboard/'),
    filename: '[name].js',
  },
};

module.exports = config;
