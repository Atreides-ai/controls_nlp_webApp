const { override } = require('customize-cra');
const cspHtmlWebpackPlugin = require('csp-html-webpack-plugin');

const cspConfigPolicy = {
    'default-src': "'none'",
    'base-uri': "'self'",
    'object-src': "'none'",
    'script-src': ["'self'", 'https://fonts.googleapis.com'],
    'style-src': ["'self'"],
    'img-src': "'self'",
    'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'manifest-src': "'self'",
    'connect-src': "'self'",
    'frame-src': "'self'",
    'frame-ancestors': "'self'",
    'media-src': "'self'",
    'object-src': "'self'",
    'prefetch-src': "'self'",
};

function addCspHtmlWebpackPlugin(config) {
    if (process.env.NODE_ENV === 'production') {
        config.plugins.push(new cspHtmlWebpackPlugin(cspConfigPolicy));
    }

    return config;
}

module.exports = {
    webpack: override(addCspHtmlWebpackPlugin),
};
