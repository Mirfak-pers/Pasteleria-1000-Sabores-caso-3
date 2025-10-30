const webpackConfig = require('./webpack.config.js');

module.exports = function(config) {
    config.set({
        //Framework base
        framework: ['jasmine'],

        //Archivos a incluir en las pruebas
        files: [
            'src/**/*.test.js',
            'src/**/*.test.jsx',
            'src/**/*.test.ts',
            'src/**/*.test.tsx'
        ],

        //Preprocesadores
        preprocessors: {
            'src/**/*.test.js' : ['webpack'],
            'src/**/*.test.jsx' : ['webpack'],
            'src/**/*.test.ts' : ['webpack'],
            'src/**/*.test.tsx' : ['webpack'],
        },

        //Configuración de Webpack
        webpack: {
            ...webpackConfig,
            mode: 'development',
            resolve: {
                ...webpackConfig.resolve,
                alias: {
                    ...webpackConfig.resolve.alias,
                }
            }
        },

        //Navegadores
        browsers: [ 'Chrome '],
        reporters: ['progress'],
        logLevel: config.LOG_INFO,
        autoWatch: true,
        singleRun: process.env.CI === 'true',
        concurrency: Infinity,
        plugins: [
            'karma-jasmine',
            'karma-chrome-launcher',
            'karma-webpack'
        ]

    })
}