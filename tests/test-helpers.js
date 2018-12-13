const fs = require('fs');
const path = require('path');

const fixtures = [];
const BASE_DIR = path.resolve(__dirname, 'fixtures');

global.fixtures = fixtures;

for (const item of fs.readdirSync(BASE_DIR)) {
  if (fs.lstatSync(path.join(BASE_DIR, item)).isDirectory()) {
    continue;
  }

  const ext = new RegExp(`(${path.extname(item)})`);

  fixtures.push({
    name: item,
    content: fs.readFileSync(path.join(BASE_DIR, item), 'utf-8'),
    expected: fs.readFileSync(
      path.join(BASE_DIR, 'outputs/', item.replace(ext, '.expected$1')),
      'utf-8',
    ),
  });
}
