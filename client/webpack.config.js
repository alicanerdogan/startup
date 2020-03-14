const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const { getGlobalStyles } = require("tailwind-in-js");
const CleanCSS = require("clean-css");

const globalStyle = `
${getGlobalStyles()}
* {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;

  -webkit-tap-highlight-color: transparent;
}
html {
  max-height: 100%;
}
* {
  font-family: "Roboto Condensed", sans-serif;
}
`;
const minifiedGlobalStyle = new CleanCSS({ sourceMap: false }).minify(
  globalStyle
).styles;

const API_HOSTNAME = "http://localhost:3000";

const isProduction = process.argv.includes("--mode=production");

const plugins = [
  new HtmlWebpackPlugin({
    title: "Firestarter",
    template: "./src/index.html",
    minify: isProduction,
    globalStyle: minifiedGlobalStyle
  }),
  new ForkTsCheckerWebpackPlugin({
    tsconfig: path.resolve(__dirname, "tsconfig.json"),
    useTypescriptIncrementalApi: true,
    checkSyntacticErrors: true,
    // Required to be async to force compilation to fail due to type checks
    async: false
  })
];

if (!isProduction) {
  console.log("ReactRefreshWebpackPlugin");
  plugins.push(new ReactRefreshWebpackPlugin({ disableRefreshCheck: true }));
}

module.exports = {
  entry: "./src/index.tsx",
  output: {
    filename: isProduction ? "[name].[contenthash].js" : "[name].[hash].js",
    path: __dirname + "/dist",
    publicPath: "/"
  },
  devtool: isProduction ? "source-map" : "cheap-module-source-map",
  devServer: {
    host: "0.0.0.0",
    contentBase: "./dist",
    compress: true,
    historyApiFallback: true,
    overlay: true,
    hot: true,
    clientLogLevel: "none",
    proxy: {
      "/api": {
        target: API_HOSTNAME
      }
    },
    stats: "minimal"
  },
  watchOptions: {
    ignored: /node_modules/
  },
  resolve: {
    modules: ["node_modules", path.resolve(__dirname, "src")],
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  module: {
    rules: [
      {
        type: "javascript/auto",
        test: /\.svg$/,
        use: [
          {
            loader: "@svgr/webpack"
          },
          {
            loader: "file-loader",
            options: {
              name: "[name].[hash].[ext]"
            }
          }
        ]
      },
      {
        type: "javascript/auto",
        test: /\.(png|jpg|gif|ico|xml|json)$/,
        include: [path.resolve(__dirname, "src/assets")],
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[hash].[ext]"
          }
        }
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            envName: isProduction ? "production" : "development",
            cacheDirectory: true
          }
        }
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            envName: isProduction ? "production" : "development",
            cacheDirectory: true
          }
        }
      }
    ]
  },
  plugins,
  optimization: {
    minimizer: isProduction ? [new TerserPlugin()] : [],
    splitChunks: {
      minChunks: 2,
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "async"
        }
      }
    }
  }
};
