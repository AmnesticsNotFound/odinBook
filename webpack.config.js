
const path = require('path');

module.exports = {
  mode: 'production',
  entry: './app.js',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: 'index.js',
  },
  module: {
    rules: [{ test: /\.html$/, use: 'loader' }],
  },
  devServer: {
    historyApiFallback:{
        index:'build/index.html'
    },
},
  target: 'node',
};