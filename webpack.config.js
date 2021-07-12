const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  // Generate sourcemaps for proper error messages -> devtool: 'source-map',
  devtool: false,
  // Since 'aws-sdk' is not compatible with webpack,
  // we exclude all node dependencies
  externals: [nodeExternals()],
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  optimization: {
    // We do not want to minimize our code.
    minimize: false,
  },
  performance: {
    // Turn off size warnings for entry points
    hints: false,
  },
  // Run babel on all .js files and skip those in node_modules
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: __dirname,
<<<<<<< HEAD
        exclude: [/src\/mochaFunctions/, /node_modules/],
=======
        exclude: /node_modules/,
>>>>>>> promises
      },
    ],
  },
};

// exclude: [
//   path.resolve(__dirname, 'src/mochaFunctions/'),
// ],

// exclude: [
//   /src\/mochaFunctions/
// ],

// exclude: [
//   './src/mochaFunctions/', // syntax error
// ],

// test: /.(js|json)?$/,
// test: /\.(js|json)?$/,

// module.exports = {
// target: 'web',
//   ...
//   experiments: {
//     outputModule: true,
//   },
//   output: {
//     libraryTarget: 'module',
//     ....
//   },
// };
