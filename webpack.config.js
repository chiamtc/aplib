module.exports = {
    entry: ['./src/app/index.js'],
    output: {
        path: __dirname + "/build",
        publicPath: '/',
        filename: 'index.js',
        library: 'M3dAudio',
        auxiliaryComment: 'Test Comment',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        globalObject: "typeof self !== 'undefined' ? self : this"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: 'babel-loader'
            }
        ]
    }
};
