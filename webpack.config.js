const path = require("path");

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "built.js",
    // Don't use the default md4. md"4".
    // https://stackoverflow.com/questions/69394632/
    hashFunction: "sha256",
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
      watch: true,
    },
    compress: true,
    port: 8080,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
};
