const { parse } = require('csv');

async function parseCsv(buffer, delimiter = ';', columns=true) {
  return new Promise((resolve, reject) => {
    const records = [];
    parse(buffer, { delimiter, columns })
      .on('data', (row) => records.push(row))
      .on('end', () => resolve(records))
      .on('error', reject);
  });
};

module.exports = parseCsv