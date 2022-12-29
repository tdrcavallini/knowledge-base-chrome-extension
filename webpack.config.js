const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new Dotenv()
  ]
};