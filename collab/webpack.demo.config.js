module.exports = {
  entry: './demo/App.tsx',
  output: {
    path: require('path').resolve(__dirname, 'demo/dist'),
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};