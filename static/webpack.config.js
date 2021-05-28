const webpack = require("webpack");

const frontend = {
  mode: process.env.NODE_ENV || "development",
  target: "web",
  entry: {
    bundle: "./javascripts/main.ts"
  },
  output: {
    path: __dirname + "/dist",
    filename: "[name].js"
  },
  devtool: "source-map",
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader"
      }, {
        test: /\.s[ac]ss$/,
        use: [
          "style-loader",
          "css-loader?url=false",
          "sass-loader"
        ]
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'ignore-loader'
      }
    ]
  }
};

module.exports = frontend;
