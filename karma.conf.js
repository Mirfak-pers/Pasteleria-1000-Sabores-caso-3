module.exports = function(config) {
    config.set({
        // Framework base
        frameworks: ['jasmine'],
        
        // Archivos a incluir en las pruebas - SOLO nuestros tests
        files: [
            'src/test/unit/**/*.test.js'
        ],
        
        // Excluir archivos problemáticos
        exclude: [
            'src/**/*.test.jsx',
            'src/**/*.test.ts',
            'src/**/*.test.tsx',
            'src/App.test.js',
            'src/components/**/*.test.js'
        ],
        
        // Preprocesadores
        preprocessors: {
            'src/test/unit/**/*.test.js': ['webpack']
        },
        
        // Webpack configurado correctamente
        webpack: {
            mode: 'development',
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
                    }
                ]
            },
            resolve: {
                extensions: ['.js']
            }
        },
        
        // Navegadores
        browsers: ['Chrome'],
        
        // REPORTERS MEJORADOS
        reporters: ['mocha', 'progress', 'kjhtml'],
        
        // Configuración específica para cada reporter
        mochaReporter: {
            output: 'autowatch',
            showDiff: true,
            colors: {
                success: 'green',
                info: 'blue',
                warning: 'yellow',
                error: 'red'
            }
        },
        
        // Configuración del reporter de spec
        specReporter: {
            maxLogLines: 5,             // Límite de líneas de log
            suppressErrorSummary: false, // Mostrar resumen de errores
            suppressFailed: false,      // Mostrar pruebas fallidas
            suppressPassed: false,      // Mostrar pruebas exitosas
            suppressSkipped: false,     // Mostrar pruebas saltadas
            showSpecTiming: true,       // Mostrar tiempo de cada spec
            failFast: false             // Detener en el primer error
        },
        
        // Plugins (agrega los nuevos)
        plugins: [
            'karma-jasmine',
            'karma-chrome-launcher',
            'karma-webpack',
            'karma-mocha-reporter',
            'karma-spec-reporter',
            'karma-jasmine-html-reporter'
        ],
        
        // Configuración adicional
        autoWatch: true,
        singleRun: process.env.CI === 'true',
        
        // Log level más detallado
        logLevel: config.LOG_INFO,
        
        // Colores en la salida
        colors: true,
        
        // Tiempo de espera
        browserNoActivityTimeout: 30000
    });
};