const ESLintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const babelLoader = {
  test: /\.js$/,
  exclude: /node_modules/,
  use: "babel-loader"
};

const ejsLoader = {
  test: /\.ejs$/,
  use: [{
    loader: "ejs-loader",
    options: {
      esModule: false
    }
  }]
};

const cssLoaders = {
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

module.exports = (config, {
  isAnalyseMode,
  isDevMode
}) => ({

  target: "web",

  mode: isDevMode ? "development" : "production",

  watch: isDevMode,

  entry: `${config.input.folder}/${config.input.entry}`,

  resolve: {
    alias: getAliases(config)
  },

  output: {
    filename: config.output.js,
    path: config.output.folder,
    publicPath: config.output.publicPath
  },

  optimization: {
    minimize: !isDevMode,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },

  module: {
    rules: [
      !isDevMode && babelLoader,
      ejsLoader,
      cssLoaders
    ].filter(Boolean)
  },

  plugins: [

    isDevMode && new ESLintPlugin({
      emitWarning: true,
    }),

    isAnalyseMode && new BundleAnalyzerPlugin(),

    new MiniCssExtractPlugin({
      filename: config.output.css,
    }),

    new HtmlWebpackPlugin({
      filename: config.output.html,
      inject: config.output.inject ?? true,
      template: `${config.input.folder}/${config.input.template}`,
    })

  ].filter(Boolean),
});

function getAliases(config, output = {}) {

  Object.entries(config.input.alias)
    .forEach(([key, value]) => {
      Object.assign(output, {
        [key]: `${config.input.folder}/${value}/`
      });
    });

  return output
}
