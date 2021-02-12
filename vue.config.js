const fs = require('fs');
const path = require('path');

module.exports = {
  // cli3 代理是从指定的target后面开始匹配的，不是任意位置；配置pathRewrite可以做替换
  devServer: {
    proxy: {
      '/api/': {
        target: 'https://192.168.21.103:8088/',
        changeOrigin: true,
        pathRewrite: {
          '^/api/': '',
        },
      },
    },
    https: {
      key: fs.readFileSync(path.join('C:/privkey.key')),
      cert: fs.readFileSync(path.join('C:/cacert.pem'))
    }
  },
};
