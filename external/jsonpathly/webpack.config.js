/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const buildConfig = (platform, extensions) => ({
  mode: 'production',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `index.${platform}.${extensions}`,
    chunkFormat: extensions === 'mjs' ? 'module' : 'commonjs',
    library: {
      type: extensions === 'mjs' ? 'module' : 'commonjs',
    },
  },
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
    extensions: ['.ts', '.js'],
  },
  externals: ["antlr4"],
  target: platform,
  plugins: [],
  devtool: 'source-map',
  experiments: {
    outputModule: extensions === 'mjs',
  },
});

module.exports = [
  //buildConfig('node', 'cjs'),
  buildConfig('node', 'mjs'),
  //buildConfig('web', 'cjs'),
  //buildConfig('web', 'mjs'),
];
