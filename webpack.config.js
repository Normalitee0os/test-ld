const path = require('path');

module.exports = {
  entry: './public/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
  externals: {
    'launchdarkly-js-client-sdk': 'LDClient'
  },
  mode: 'production',
  resolve: {
    extensions: ['.js'],
  },
};
