const isProd = process.env.NODE_ENV === 'production';

export const constants = {
  apiPrefix: isProd ? 'api-dex' : '',
  api_url: isProd
    ? 'https://jungho.dev/api-dex/api'
    : 'http://localhost:3003/api',
  prod_api_url: 'https://jungho.dev/api-dex/api',
};
