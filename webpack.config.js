const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { argv } = require("yargs");
const webpack = require("webpack");
const Fiber = require("fibers");
// import HtmlWebpackPlugin from "html-webpack-plugin";
// import MiniCssExtractPlugin from "mini-css-extract-plugin";

const env = argv.env;
const isDevelopment = env === "development";
const isProduction = env === "production";
const libPath = path.resolve(__dirname, "./lib");

module.exports = {
  mode: 'development',
  devtool: isDevelopment ? "source-map" : "",
  devServer: {
    hot: true,
    noInfo: true,
    compress: true,
    historyApiFallback: true,
    https: isProduction,
    open: true
    // contentBase: path.resolve(__dirname, "js.org")
  },
  entry: {
    index: [path.resolve(__dirname, "./docs/index.jsx")]
  },
  output: {
    publicPath: isDevelopment ? "/" : "./",
    // path: path.resolve(__dirname, "./js.org"),
    filename: `[name].js`,
    chunkFilename: `${isDevelopment ? "[id]" : "[chunkhash]"}.js`
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
        enforce: "pre"
      },
      {
        test: /\.(c|sa|sc)ss$/,
        exclude: /node_modules/,
        use: [
          isDevelopment
            ? { loader: "style-loader" }
            : { loader: MiniCssExtractPlugin.loader },
          { loader: "css-loader", options: { sourceMap: isDevelopment } },
          {
            loader: "sass-loader",
            options: {
              implementation: require("sass"),
              fiber: Fiber
            }
          }
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[path][name].[ext]"
          }
        }
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: "styles",
          test: /\.(c|sc|sa)ss$/,
          chunks: "all",
          enforce: true
        }
      }
    },
    minimize: isProduction
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"]
  },
  plugins: [
    new webpack.ProvidePlugin({
      RCLOADABLE: [path.resolve(libPath, "reactLazyLoader"), "default"]
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "docs/index.html"),
      chunksSortMode: "none"
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ]
};
