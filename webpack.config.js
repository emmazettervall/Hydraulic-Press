const path = require('path');

module.exports = {
  entry: './press.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(glb|gltf)$/,
        use: [
          {
            loader: 'gltf-webpack-loader'
          }
        ]
      }
    ]
  }
};
