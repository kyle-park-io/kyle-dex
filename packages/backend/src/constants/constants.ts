const isProd = process.env.NODE_ENV === 'prod' ? true : false;

export const constants = {
  apiPrefix: isProd ? 'api-dex' : '',
  api_url: isProd
    ? 'https://jungho.dev/api-dex/api'
    : 'http://localhost:3000/api',
  prod_api_url: 'https://jungho.dev/api-dex/api',
};
