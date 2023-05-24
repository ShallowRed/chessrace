const path = require("path");

const { red, green } = require('chalk');

const getWebpackConfig = require(path.resolve(__dirname, "webpack.commons.js"));

const CONFIGS = {

  game: {

    input: {
      folder: path.resolve(__dirname, "src"),
      // folder: path.resolve(__dirname, "src2"),
      entry: "index.js",
      template: "index.ejs",
      alias: {
        styles: "styles",
        app: "app"
      }
    },

    output: {
      folder: path.resolve(__dirname, "dist"),
      publicPath: "./",
      html: "index.html",
      js: "bundle.js",
      css: "styles.css"
      // js: "vvmap.[hash].js",
      // css: "vvmap.[hash].css"
    }
  }
}

const configName = process.env.WP_CONFIG;

const config = CONFIGS[configName];


const nodeEnv = process.env.NODE_ENV;

const isDevMode = nodeEnv === "dev";

const isAnalyseMode = nodeEnv === "analyse";


console.log(
  green("\r\n---------------------------------\r\n\r\n"),
  `Config : ${green(configName)} | mode : ${red(nodeEnv)}`,
  green("\r\n\r\n---------------------------------\r\n")
);


module.exports = getWebpackConfig(config, { isAnalyseMode, isDevMode });
