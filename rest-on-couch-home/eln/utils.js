'use strict';

const fs = require('fs');

function getImportFileChangeTime(importContext) {
  const filepath = `${importContext.fileDir}/${importContext.filename}`;
  const stat = fs.statSync(filepath);
  return Date.now() - stat.ctimeMs;
}

function getImportFileSize(importContext) {
  const filepath = `${importContext.fileDir}/${importContext.filename}`;
  const stat = fs.statSync(filepath);
  return stat.size;
}

module.exports = {
  getImportFileChangeTime,
  getImportFileSize
};
