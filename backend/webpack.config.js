const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (options, webpack) => {
  const lazyImports = [
    '@nestjs/microservices/microservices-module',
    '@nestjs/websockets/socket-module',
  ];

  return {
    ...options,
    externals: [],    
    output: {
      ...options.output,
      libraryTarget: 'commonjs2',
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'node_modules/prisma/libquery_engine-rhel-openssl-3.0.x.so.node',
            to: '',
            noErrorOnMissing: true,
          },
        ],
      }),
      ...options.plugins,      
      new webpack.IgnorePlugin({
        checkResource(resource) {
          if (lazyImports.includes(resource)) {
            try {
              require.resolve(resource);
            } catch (err) {
              return true;
            }
          }
          return false;
        },
      }),
    ],
  };
};
