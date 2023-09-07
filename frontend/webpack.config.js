const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
   const modeArg = argv.mode;
   const mode = modeArg === "development" ? "development" : "production";
   const isDevelopment = mode === "development";

   console.log("Using Mode: ", mode);

   let externals = {};
   if (mode === "production") {
      externals = {
         react: 'React',
         'react-dom': 'ReactDOM'
      }
   }
   return {
      mode,
      entry: './src/index.tsx',
      output: {
         path: path.join(__dirname, '/dist'),
         filename: "[name]-[contenthash].bundle.js",
      },
      devServer: {
         port: 8080
      },
      module: {
         rules: [
            {
               test: /\.[tj]sx?$/,
               exclude: /node_modules/,
               loader: 'ts-loader',
            },
            {
               test: /\.css$/,
               use: [ 'style-loader', 'css-loader' ]
         },
         {
            test: /\.s(a|c)ss$/,
            use: [
            isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
            
            {
               loader: 'css-loader',
               options: {
                  modules: true,
                  sourceMap: isDevelopment
               }
            },
            {
               loader: 'sass-loader',
               options: {
                  sourceMap: isDevelopment
               }
            }
            ]
         },
         
         ]
      },
      plugins:[
         new MiniCssExtractPlugin({
            filename: isDevelopment ? '[name].css' : '[name].[contenthash].css',
            chunkFilename: isDevelopment ? '[id].css' : '[id].[contenthash].css'
         }),
         new HtmlWebpackPlugin({
               template: path.join(__dirname,'/src/index-' + mode + '.html'),
               publicPath: "/",
         }),
      ],
      resolve: {
         extensions: [ '.tsx', '.ts', '.js', '.scss' ],
      },
      externals: externals,
   }
}