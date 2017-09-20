const ejs = require('ejs');
const templatePath = __dirname + '/../static/components/index.ejs';
const URLS = JSON.parse(process.env.URLS);

/**
* @returns {buffer}
*/
module.exports =  (context, callback) => {

  let templateVars = {
    displayNames: URLS.map(url => url.displayName),
    services: URLS.map(url => url.url),
    servicePath: context.service.identifier,
    title: process.env.TITLE,
  };

  ejs.renderFile(templatePath, templateVars, {}, (err, data) => {
    return callback(err, new Buffer(data || ''), {'Content-Type': 'text/html'})
  });

};
