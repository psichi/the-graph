const defaultConfig = require('@kadira/storybook/dist/server/config/defaults/webpack.config')
const path = require('path');
const webpack = require('webpack');

module.exports = (config, configType) => {
  console.log('Override config %s', configType);

  const defConf = defaultConfig(config);
  // defConf.devtool = '#cheap-module-eval-source-map'
  defConf.devtool = 'eval-source-map'
  defConf.module.loaders = config.module.loaders.concat([
      // the url-loader uses DataUrls.
      // the file-loader emits files.
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff',
        include: path.resolve(__dirname, '../src')
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
        include: path.resolve(__dirname, '../src')
      }
    ]
  );

  return defConf;
};
