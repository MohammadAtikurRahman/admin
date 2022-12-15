module.exports = function (webpackEnv) {
    return {
        resolve: {
            fallback: {
                crypto: require.resolve("crypto-browserify"),
            },
        },
    };
};
