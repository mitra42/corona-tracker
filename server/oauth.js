const debug = require('debug')('corona-tracker:oauth');
const { httptools } = require('@internetarchive/dweb-transports');

// Support for OAUTH, currently used by Strava
function oauthGetCode(req, res, { domainOauthUrl, clientId, protoHostPort } = {}) {
  const redirectUrl = protoHostPort + req.originalUrl; // May need to overwrite this, but presume goes to SAME path with 'code' parameter
  const url = `https://${domainOauthUrl}/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUrl}&approval_prompt=force&scope=read,activity:write`;
  res.redirect(url);
}
function oauthGetToken(req, res, { domainOauthUrl, clientId, clientSecret, name } = {}, cb) {
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
