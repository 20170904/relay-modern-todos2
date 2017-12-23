const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const nodeEnv = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || 3000;
const ENDPOINT = process.env.ENDPOINT;

if(!ENDPOINT){
  throw new Error('ENDPOINT not in node env!');
}
console.log(ENDPOINT.substring(0, ENDPOINT.lastIndexOf('/')));

const isProd = nodeEnv === 'production';

let plugins = [
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: Infinity,
    filename: 'vendor.bundle.js'
  }),
  new webpack.DefinePlugin({
    'process.env': {NODE_ENV: JSON.stringify(nodeEnv)} //注意一定要JSON.stringify
  }),
  new HtmlWebpackPlugin({
    template: path.join(__dirname, 'src/index.html'),
    favicon: path.join(__dirname, 'public/images/logo.ico'),
    production: isProd,
    minify: {
      removeComments: true,
      collapseWhitespace: false,
    }
  })
];

if (isProd) {
  plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false,
        drop_console: true,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      },
      output: {
        comments: false
      }
    })

  )
} else {
  plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  )
}


module.exports = {
  devtool: isProd ? 'source-map' : 'cheap-module-source-map',
  entry: {
    app: [
      'babel-polyfill',
      path.join(__dirname, 'src/index.js')
    ],
    vendor: ['react', 'react-dom']
  },
  output: {
    filename: '[name].[hash].js',
    path: path.join(__dirname, 'build'),
    publicPath: '/'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader",
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            plugins: (loader) => [
              require('autoprefixer')({browsers: ['last 5 Chrome versions', 'last 5 Firefox versions', 'Safari >= 8', 'ie > 10']})
            ]
          }
        }
      ]
    }, {
      test: /\.less$/,
      include: /themes/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            plugins: (loader) => [
              require('autoprefixer')({browsers: ['last 5 Chrome versions', 'last 5 Firefox versions', 'Safari >= 8', 'ie > 10']})
            ]
          }
        },
        'less-loader'
      ]
    }, {
      test: /\.less$/,
      exclude: /themes/,
      use: [
        'style-loader',
        'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
        {
          loader: 'postcss-loader',
          options: {
            plugins: (loader) => [
              require('autoprefixer')({browsers: ['last 5 Chrome versions', 'last 5 Firefox versions', 'Safari >= 8', 'ie > 10']})
            ]
          }
        },
        'less-loader'
      ]
    }, {
      test: /\.(jpe?g|png|gif|svg|eot|ttf|woff|woff2)$/i,
      exclude: /node_modules/,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'images/[name]_[hash].[ext]'
          }
        }
      ]
    }]
  },

  plugins: plugins,
  resolve: {
    alias: {
      Alu: path.resolve(__dirname, 'client'),
      AluClinic: path.resolve(__dirname),
    }
  },
  devServer: {
    contentBase: path.join(__dirname, "public"),
    publicPath: '/',
    stats: {colors: true},
    historyApiFallback: true,
    watchContentBase: true,
    port: PORT,
    proxy: {
      '/graphql': ENDPOINT.substring(0, ENDPOINT.lastIndexOf('/'))
    },
  },
};
