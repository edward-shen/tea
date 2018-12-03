#!/usr/bin/env node

var fs = require('fs');

try {
  var level = require('level');
} catch(e) {
  console.error("You must have the node module `level` installed.");
  console.error("To install run: `npm install level`");
  process.exit(1);
}

if(process.argv.length !== 3) {
  console.error("Usage: leveldump <path_to_db>");
  process.exit(1)
}

var dbPath = process.argv[2];

try {
var stats = fs.statSync(dbPath);
} catch(e) {
  console.error("No such leveldb database");
  process.exit(1)
}

if(!stats.isDirectory()) {
  console.error("No such leveldb database");
  process.exit(1)
}

try {
  var db = level(dbPath, {valueEncoding: 'json'});
} catch(e) {
  console.error("Could not open leveldb database");
  process.exit(1)
}

s = db.createReadStream();

s.on('data', function(data) {
  console.log(data.key, data.value);
})
