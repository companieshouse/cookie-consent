const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { version } = require('./package.json')

module.exports = {
  entry: './src/index.ts',
  target: 'es5',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin()
  ],
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    library: 'CookieConsent',
    filename: `cookie-consent-${version}.js`,
    path: path.resolve(__dirname, 'dist')
  }
}
