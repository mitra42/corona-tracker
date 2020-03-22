const debug = require('debug')('corona-tracker:strava');
const { httptools } = require('@internetarchive/dweb-transports');
const FormData = require('form-data');

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
exports = module.exports = { uploadToStrava };

