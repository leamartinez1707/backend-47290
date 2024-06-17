import path from 'path';
import webpackNodeExternals from 'webpack-node-externals';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

export default {
    mode: 'production',
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'final.js',
    },
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: "babel-loader",
            }
        ]
    },
    externalsPresets: { node: true }, // in order to ignore built-in modules like path, fs, etc.
    externals: [webpackNodeExternals()], // in order to ignore all modules in node_modules folder
};