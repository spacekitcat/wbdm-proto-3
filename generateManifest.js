#!/usr/bin/env node

const fs = require('fs');
const jsonfile = require('jsonfile');

fs.readdir('./TR909all-mp3', (err, files) => {

  let list = [];
  let id = 0;
  files.forEach(item => {
    list.push({ file: item, id: id++  });
  });
 
  jsonfile.writeFile('manifest.json', { samples: list}, err => {
    if (err) {
      console.log('Error writing manigest: ' + err);
    } else {
      console.log('Manifest written.');
    }
  });
});


