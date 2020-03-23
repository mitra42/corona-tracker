const debug = require('debug')('corona-tracker:strava');
const { httptools } = require('@internetarchive/dweb-transports');
const FormData = require('form-data');

const stravaOauthConfig = {
  name: 'Strava', // For debug messages etc
  domainOauthUrl: 'www.strava.com/oauth',
  clientId: '44623',
  clientSecret: '2b8f90e1995ea9699af363e140f5aeffb5f17939',
  external_id: 'upload_from_api', // Maybe should be random, or supplied in req.query
  protoHostPort: 'http://localhost:5000', // Fiendishly hard to get in express; TODO-STRAVA change to cs19.mitra.biz
};

function uploadToStrava({ name, authorization, str } = {}, cb) {
  const url = 'https://www.strava.com/api/v3/uploads';
  const data = {
    'name': 'Upload from corona tracker api', // TODO this should come from data set name
    'data_type': 'gpx',
    'external_id': 'upload_from_api'
  };
  const form = new FormData();
  Object.entries(data)
    .forEach(kv => form.append(kv[0], kv[1]));
  form.append('file', str);
  // Alternative fetch(new Request(url, {method: 'post', headers, body: form}).then(res1 => res1.json()).then(j => res.send(`Success %{j.sid_str}`)).catch(...)
  debug('Uploading to Strava');
  httptools.POST(url, {
    headers: { Authorization: authorization, ...form.getHeaders() },
    data: form
  }, cb);
}
exports = module.exports = { stravaOauthConfig, uploadToStrava };

