const path = require('path');

module.exports = {
  entry: './src/rain.js',
  output: {
    filename: 'rain.min.js',
    path: path.resolve(__dirname, 'dist'),
    /*clean: true,*/
  },
};