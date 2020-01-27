const ApiClient = require("./apiclient");
const CardFetcher = require("./cardfetcher");
const { createObjectCsvWriter } = require("csv-writer");
const addbom = require("./addbom");

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

    const path = `${__dirname}/${board.title}.csv`;
    const csvWriter = createObjectCsvWriter({
      path,
      header: [
        { id: "id", title: "id" },
        { id: "swimlane", title: "swimlane" },
        { id: "list", title: "list" },
        { id: "title", title: "title" },
        { id: "description", title: "description" }
      ]
    });

    await csvWriter.writeRecords(cards);
    await addbom(path);
  }
}

const url = process.argv[2];
const username = process.argv[3];
const password = process.argv[4];

fetch(url, username, password);
