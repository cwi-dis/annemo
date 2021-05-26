const webpack = require("webpack");

const backend = {
  mode: process.env.NODE_ENV || "development",
  target: "node",
  node: {
    __dirname: true
  },
  entry: {
    backend: "./emotions.ts",
  },
  output: {
    path: __dirname + "/bin",
    filename: "[name].js"
  },
  devtool: "source-map",
  resolve: {
    extensions: [".js", ".ts"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader"
      }
    ]
  }
};

module.exports = backend;
