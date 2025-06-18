const config = require('../config/environment');

class ApiService {
  constructor() {
    this.baseUrl = config.apiUrl;
  }

  async makeRequest(endpoint) {
    const url = `${this.baseUrl}${endpoint}`;
    // sua lógica de requisição aqui
    return fetch(url);
  }
}

module.exports = ApiService;