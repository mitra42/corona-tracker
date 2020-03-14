#!/usr/bin/env node
/* eslint-disable arrow-parens, no-console, max-len, no-param-reassign, no-regex-spaces, no-plusplus, no-return-assign, quote-props */
const readline = require('readline');
const fs = require('fs');
const canonicaljson = require('@stratumn/canonicaljson');
/* Note there aren't defined as dependencies as resistance to adding deps and this doesnt get run often */
/* eslint-disable import/no-extraneous-dependencies */
const waterfall = require('async/waterfall');
const each = require('async/each');

const sourceFileName = 'google/_.txt';
const source = [];
const sourceMetadata = [];

/**
 * @param name filename to read
 * @param sourceArr
 * @param cb()
 */
function readOne(name, sourceArr, cb) {
  const rlsource = readline.createInterface({
    input: fs.createReadStream(name),
    output: process.stdout,
    terminal: false
  });
  rlsource.on('line', line => sourceArr.push(line));
  rlsource.on('close', () => cb());
}
function readSource(cb) {
  waterfall([
    cb1 => readOne(sourceFileName, source, cb1),
  ], cb);
}

function readJson(filename, cb) {
  /*
  Read JSON from filename and return via cb(err, res),
  or return error if unable to read or parse.
  */
  const silentReadFailure = false;
  fs.readFile(filename, 'utf8', (err, jsonstr) => {
    if (err) {
      if (!silentReadFailure) {
        console.error('Unable to read', filename, err.message);
      }
      cb(err, {});
    } else {
      try {
        const o = canonicaljson.parse(jsonstr);
        try { cb(null, o); } catch (err1) { console.error('ERROR: Uncaught err in readJson cb', err1); }
      } catch (err2) {
        console.error('Unable to parse json:', err2.message);
        cb(err2, {});
      }
    }
  });
}
function writeOne(inputFileName, writable, sourceArr, manual, cb) {
  const rl = readline.createInterface({
    input: fs.createReadStream(inputFileName),
    output: process.stdout,
    terminal: false
  });
  let i = 0;
  rl.on('line', (line) => {
    const tag = sourceArr[i++];
    const translated = manual[tag] || line.trim(); // Use manual version if possible
    writable.write(`"${tag}": "${translated}",\n`);
  });
  rl.on('close', () => {
    if (i !== sourceArr.length) {
      // writable.write(`//TODO doesnt look like it matches source length=${source.length} ${inputFileName} length =${i}\n`);
      console.log(`Doesnt look like it matches source length=${sourceArr.length} ${inputFileName} length =${i}\n`);
    }
    cb();
  });
}
function writeOutput(name, cb) {
  const outputFileName = `json/${name}.json`;
  const writable = fs.createWriteStream(outputFileName);
  //  writable.write(`const ${name} = {\n`); //JS
  writable.write('{\n'); // JSON
  let manual;
  waterfall([
    cb1 => readJson(`manual/${name}.json`, (err, m) => { manual = m; cb1(err); }),
    cb1 => writeOne(`google/${name}.txt`, writable, source, manual, cb1),
  ], () => {
    // writable.write('};\n'); // JS
    // writable.write(`export { ${name} };\n`); // JSs
    writable.write('"":"" }\n'); // JSON
    writable.close();
    cb();
  });
}

  // SEE-OTHER-ADDLANGUAGE - note cant import this from languages as may include ones here before built
  // noinspection UnnecessaryLocalVariableJS
  const fulllanguages = ['english', 'french'];
  let thisbuild = fulllanguages;
  thisbuild = ['english']; // Uncomment this to only rebuild english while testing before translating
  waterfall([
    cb => readSource(cb),
    cb2 => each(thisbuild,
      (l, cb1) => writeOutput(l, cb1),
      (unusedErr) => cb2),
  ], (unusedErr, unusedRes) => {
    console.log('DONE');
  });
