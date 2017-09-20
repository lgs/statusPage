const db = require('../lib/db');
const http_request = require('../lib/http_request');

/**
* @param {array} urls
* @param {string} key
* @returns {any}
*/
module.exports = async (urls, key, context) => {

  if (key !== process.env.AUTH_KEY) {
    throw new Error('Invalid auth key')
  }

  let requests = await Promise.all(urls.map(url => http_request.profile(url)));
  return await Promise.all(requests.map(item => db.addItem(item)));

};
