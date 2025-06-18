const environments = {
  development: {
    apiUrl: 'http://localhost:3000/api',
    baseUrl: 'http://localhost:3000'
  },
  test: {
    apiUrl: 'https://test-api.exemplo.com/api',
    baseUrl: 'https://test.exemplo.com'
  },
  production: {
    apiUrl: 'https://api.exemplo.com/api',
    baseUrl: 'https://exemplo.com'
  }
};

const currentEnv = process.env.NODE_ENV || 'development';
module.exports = environments[currentEnv];