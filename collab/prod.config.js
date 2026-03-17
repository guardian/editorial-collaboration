module.exports = {
    entry: './src/server.ts',
    mode: 'production',
    target: 'node',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
        parser: {
            javascript: {
                dynamicImportMode: 'eager',
            },
        },
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
};