const path = require("path");
const webpack = require("webpack");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const ESLintPlugin = require('eslint-webpack-plugin');

const analyse = process.env.NODE_ENV == "analyse";
const dev = process.env.NODE_ENV == "dev";

console.log("Dev mode :", dev);

const config = {
  input: {
    js: "./src/index.js",
    ejs: "./src/index.ejs"
  },
  output: {
    folder: "./dist",
    html: "index",
    js: "bundle",
    // js: "vvmap.[hash]",
    css: "styles"
    // css: "vvmap.[hash]"
  }
}

const babelRules = {
  test: /\.js$/,
  exclude: /node_modules/,
  use: "babel-loader"
};

const ejsRules = {
  test: /\.ejs$/,
  use: [{
    loader: "ejs-loader",
    options: {
      esModule: false
    }
  }]
};

const jsonRules = {
  test: /\.(geo)?json$/,
  exclude: /node_modules/,
  loader: "json-loader"
};

const cssRules = {
  test: /\.css$/,
  use: [{
      loader: MiniCssExtractPlugin.loader,
    },
    {
      loader: "css-loader",
      options: {
        importLoaders: 1
      }
    },
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          ident: "postcss",
          plugins: [
            require("postcss-normalize")(),
            require("postcss-preset-env")({
              stage: 3,
              features: {
                "nesting-rules": true
              }
            })
          ]
        }
      }
    }
  ]
}

//////////////////////////////
module.exports = {
  target: "web",
  mode: dev ? "development" : "production",
  watch: dev,
  entry: config.input.js,
  resolve: {
    alias: {
      styles: path.resolve(__dirname, "src/styles/"),
      app: path.resolve(__dirname, "src/app/")
    }
  },
  output: {
    filename: `${config.output.js}.js`,
    path: path.resolve(__dirname, `${config.output.folder}`),
    publicPath: `./`
  },
  optimization: {
    minimize: !dev,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin({})],
  },
  module: {
    rules: [
      jsonRules,
      // esLintRules,
      // dev ? esLintRules : false,
      !dev ? babelRules : false,
      ejsRules,
      cssRules
    ].filter(Boolean)
  },
  plugins: [
    new ESLintPlugin({
      emitWarning: true,
    }),
    analyse ? new BundleAnalyzerPlugin() : false,
    new MiniCssExtractPlugin({
      filename: `${config.output.css}.css`,
    }),
    new HtmlWebpackPlugin({
      filename: `${config.output.html}.html`,
      inject: true,
      template: path.resolve(__dirname, config.input.ejs),
    })
  ].filter(Boolean),
};
