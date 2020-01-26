const ApiClient = require("./apiclient");
const CardFetcher = require("./cardfetcher");
const { createObjectCsvWriter } = require("csv-writer");

async function fetch(url, username, password) {
  const client = new ApiClient(url);

  await client.login(username, password);
  const boards = await client.getBoards();

  for (const board of boards) {
    const fetcher = new CardFetcher(board, client);
    const cards = await fetcher.fetchAllCards();

    if (cards.length === 0) {
      continue;
    }

    const csvWriter = createObjectCsvWriter({
      path: `${__dirname}/${board.title}.csv`,
      header: [
        { id: "id", title: "id" },
        { id: "swimlane", title: "swimlane" },
        { id: "list", title: "list" },
        { id: "title", title: "title" },
        { id: "description", title: "description" }
      ]
    });

    csvWriter.writeRecords(cards);
  }
}

const url = process.argv[2];
const username = process.argv[3];
const password = process.argv[4];

fetch(url, username, password);
