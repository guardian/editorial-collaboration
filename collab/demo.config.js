const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require('path');

module.exports = {
  entry: './demo/index.tsx',
  mode: 'development',
  output: {
    publicPath: '/',
  },
  devServer: {
    port: 3001,
    historyApiFallback: true,
    allowedHosts: [
      'editorial-collaboration-demo.local.dev-gutools.co.uk',
    ],
    client: {
      webSocketURL: "http://localhost:3001/ws",
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-react', {"runtime": "automatic", "importSource": "@emotion/react"}],
            ]
          }
        },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve( __dirname, './demo/public/index.html' ),
      filename: 'index.html'
    })
  ]
};
