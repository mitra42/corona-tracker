/*
Quick and dirty sqlite server

# TODO-PORT this will run on port 5000, Main.js should be parameterised so can take an argument for the port

Uses a library of functions
 */
process.env.DEBUG = 'corona-tracker:*';
const debug = require('debug')('corona-tracker:Main');
const express = require('express'); // http://expressjs.com/
const morgan = require('morgan'); // https://www.npmjs.com/package/morgan
const getopts = require('getopts');
const DwebTransports = require('@internetarchive/dweb-transports'); // Also sets this as a global
// TODO-CT const { appContent, appList, appSelect } = require('./sqllib.js');
const { appDataset, appIsrael2Takeout, appKorea12Takeout, appKorea22Takeout } = require('./apps');

const optsInt = ["port"];
const opts = getopts(process.argv.slice(2), {
  alias: { h: 'help', p: 'port' },
  boolean: ['h'],
  default: { "port": 5000 },
  "unknown": option => { console.log("Unknown option", option, ", 'node Main.js -h' for help"); process.exit()}
});
const help = `
usage: node ./Main.js [--port]
  --port 80: Run on another port - typically 80 for http, defaults to 5000
`;
if (opts.help) { console.log(help); process.exit(); }

const config = {
  morgan: ':method :url :req[range] :status :res[content-length] :response-time ms',
  port: opts.port,
  static: process.cwd() + '/../dist',
  languages: process.cwd() + '/../languages/json',
};

const app = express();

app.use(morgan(config.morgan)); // TODO write to a file then recycle that log file (see https://www.npmjs.com/package/morgan )
app.use(express.json());
app.get('/', (req, res) => res.sendFile('client.html',
  { root: config.static },
  err => { if (err) { res.status(404).send(err.message); } }));
app.get('/dist/:file', (req, res) => res.sendFile(req.params.file,
  { root: config.static },
  err => { if (err) { res.status(404).send(err.message); } }));
app.get('/languages/:file', (req, res) => res.sendFile(req.params.file,
  { root: config.languages },
  err => { if (err) { res.status(404).send(err.message); } }));

// Data conversions
app.get('/data/:dataset', appDataset)

// Feel free to add more sandbox lines - move them once tested

const server = app.listen(config.port); // Intentionally same port as Python gateway defaults to, api should converge
debug('Server starting on port %s', config.port);
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    debug('A server, probably another copy of this, is already listening on port %s', config.apps.http.port);
  } else {
    debug('Server hit error %o', err);
    throw (err); // Will be uncaught exception
  }
});
