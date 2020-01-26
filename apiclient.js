const fetch = require("node-fetch");

class ApiClient {
  constructor(url) {
    this.url = url;
  }

  async login(username, password) {
    const body = {
      username,
      password
    };

    const res = await fetch(`${this.url}/users/login`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" }
    });
    const json = await res.json();

    this.userId = json.id;
    this.token = json.token;
  }

  async getBoards() {
    return await this.fetchApi(`/users/${this.userId}/boards`);
  }

  async getLists(boardId) {
    return await this.fetchApi(`/boards/${boardId}/lists`);
  }

  async getSwimlanes(boardId) {
    return await this.fetchApi(`/boards/${boardId}/swimlanes`);
  }

  async getCardsbByList(boardId, listId) {
    return await this.fetchApi(`/boards/${boardId}/lists/${listId}/cards`);
  }

  async getCardsbBySwimlane(boardId, swimlaneId) {
    return await this.fetchApi(
      `/boards/${boardId}/swimlanes/${swimlaneId}/cards`
    );
  }

  async fetchApi(endpoint) {
    const res = await fetch(`${this.url}/api${endpoint}`, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
    return await res.json();
  }
}

module.exports = ApiClient;
