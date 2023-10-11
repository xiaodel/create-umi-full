import { defineConfig } from '@umijs/max';
import routes from './src/routes';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '@umijs/max',
  },
  routes,
  npmClient: '{{{ npmClient }}}',
  proxy:{
        '/api': {
            'target': 'http://jsonplaceholder.typicode.com/',
            'changeOrigin': true,
            'pathRewrite': { '^/api' : '' },
        },
  }
});

