const fs = require("fs").promises;

async function addbom(path) {
  const contents = await fs.readFile(path, "utf-8");
  await fs.writeFile(path, "\uFEFF" + contents);
}

module.exports = addbom;
