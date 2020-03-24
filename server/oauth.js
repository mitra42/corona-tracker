/* eslint-disable camelcase *//* camelcase because passing to API */
const debug = require('debug')('corona-tracker:oauth');
const { httptools } = require('@internetarchive/dweb-transports');
const url = require('url');

// Support for OAUTH, currently used by Strava
function oauthGetCode(req, res, { name, domainOauthUrl, clientId, protoHostPort } = {}) {
  // May need to overwrite this, but presume goes to SAME path with 'code' parameter
  debug('requesting authentication code for %s', name);
  const redirect_uri = protoHostPort + req.originalUrl;
  const newUrl = url.format({
    pathname: `https://${domainOauthUrl}/authorize`,
    query: {
      client_id: clientId,
      response_type: 'code',
      redirect_uri,
      approval_prompt: 'force',
      scope: 'read,activity:write'
    }
  });
  res.redirect(newUrl);
}
function oauthGetToken(req, res, { domainOauthUrl, clientId, clientSecret, name } = {}, cb) {
  debug('requesting authentication token for %s', name);
  const data = {
    grant_type: 'authorization_code',
    client_id: clientId,
    client_secret: clientSecret,
    code: req.query.code
  };
  httptools.POST(
    `https://${domainOauthUrl}/token`,
    { data: JSON.stringify(data), contenttype: 'application/json' },
    (err, obj) => {
      debug('%s Authentication %o => %o', name, data, err || obj);
      if (err) {
        res.send(500, 'Failed in second step of authentication to %s: %s', name, err.message);
        cb(err);
      } else {
        const authorization = `${obj.token_type} ${obj.access_token}`;
        cb(null, authorization); // Should be json
      }
    });
}


exports = module.exports = { oauthGetCode, oauthGetToken };
