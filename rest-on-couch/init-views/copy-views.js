'use strict';

const fs = require('fs');
const path = require('path');

const username = process.env.COUCHDB_USER;
const password = process.env.COUCHDB_PASSWORD;

const nano = require('nano')(`http://${username}:${password}@couchdb:5984`);

const visualizer = nano.db.use('visualizer');

const viewsDir = '/init-views/views';

(async () => {
  if (fs.existsSync(viewsDir)) {
    const files = fs.readdirSync(viewsDir);
    for (const file of files) {
      if (!file.endsWith('.json')) {
        continue;
      }
      const filename = file.replace('.json', '');
      const data = fs.readFileSync(path.join(viewsDir, file));
      const json = JSON.parse(data.toString('utf8'));
      const result = await visualizer.insert({
        $type: 'entry',
        $id: null,
        $kind: 'view',
        $owners: ['admin@cheminfo.org', 'anonymousRead'],
        $content: {
          version: json.version,
          title: json.configuration.title,
          flavors: {
            default: [filename]
          },
          keywords: []
        },
        $lastModification: 'admin@cheminfo.org',
        $modificationDate: 1540000000000,
        $creationDate: 1540000000000
      });
      const { id, rev } = result;
      await visualizer.attachment.insert(id, 'view.json', data, 'application/json', {
        rev
      });
    }
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
