import path from 'path';
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
    target: 'node',
    module: {
        rules: [
            {
                test: /\.(?:js|mjs|cjs)$/,
                exclude: `${__dirname}/node_modules/`,
                loader: 'babel-loader'
            }

        ]
    }
};