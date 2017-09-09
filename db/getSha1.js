// tmkelly's getSha1 from fvs
'use strict';

const crypto = require('crypto');

module.exports = function getSha1 (data) {
  return crypto
    .createHash('sha1')
    .update(data)
    .digest('hex');
};