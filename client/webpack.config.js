const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const API_HOSTNAME = "http://localhost:3000";

const isProduction = process.argv.includes("--mode=production");

const plugins = [
  new MiniCssExtractPlugin({
    filename: "[name].[contenthash].css",
    chunkFilename: "[name].[contenthash].css",
    ignoreOrder: true,
  }),
  new HtmlWebpackPlugin({
    title: "Firestarter",
    template: "./src/index.html.erb",
    minify: isProduction,
    fontUrl:
      "https://fonts.googleapis.com/css?family=Roboto+Condensed:400,700&display=swap",
  }),
  new ForkTsCheckerWebpackPlugin({
    typescript: {
      configFile: path.resolve(__dirname, "tsconfig.json"),
    },
    // Required to be async to force compilation to fail due to type checks
    async: !isProduction,
  }),
];

if (!isProduction) {
  plugins.push(new ReactRefreshWebpackPlugin());
}

module.exports = {
  entry: "./src/index.tsx",
  output: {
    filename: isProduction ? "[name].[contenthash].js" : "[name].[hash].js",
    path: __dirname + "/dist",
    publicPath: "/",
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
        target: API_HOSTNAME,
      },
    },
    stats: "minimal",
  },
  watchOptions: {
    ignored: /node_modules/,
  },
  resolve: {
    modules: ["node_modules", path.resolve(__dirname, "src")],
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: !isProduction,
            },
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: false,
            },
          },
        ],
      },
      {
        type: "javascript/auto",
        test: /\.svg$/,
        use: [
          {
            loader: "@svgr/webpack",
          },
          {
            loader: "file-loader",
            options: {
              name: "[name].[hash].[ext]",
            },
          },
        ],
      },
      {
        type: "javascript/auto",
        test: /\.(png|jpg|gif|ico|xml|json)$/,
        include: [path.resolve(__dirname, "src/assets")],
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[hash].[ext]",
          },
        },
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            envName: isProduction ? "production" : "development",
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            envName: isProduction ? "production" : "development",
            cacheDirectory: true,
          },
        },
      },
    ],
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
          chunks: "async",
        },
      },
    },
  },
};
