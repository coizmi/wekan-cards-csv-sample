class CardFetcher {
  constructor(board, client) {
    this.board = board;
    this.client = client;
    this.cards = [];
  }

  async fetchAllCards() {
    const lists = await this.client.getLists(this.board._id);
    const listTitles = {};
    lists.forEach(list => {
      listTitles[list._id] = list.title;
    });

    const swimlanes = await this.client.getSwimlanes(this.board._id);
    const results = [];
    for (const swimlane of swimlanes) {
      const cards = await this.client.getCardsbBySwimlane(
        this.board._id,
        swimlane._id
      );
      if (cards.length === 0) {
        return [];
      }
      const converted = this.convert(cards, swimlane, listTitles);
      results.push(...converted);
    }
    return results;
  }

  convert(cards, swimlane, listTitles) {
    return cards.map(card => {
      return {
        id: card._id,
        swimlane: swimlane.title,
        list: listTitles[card.listId],
        title: card.title,
        description: card.description
      };
    });
  }
}

module.exports = CardFetcher;
