const db = require('../helpers/db');

/**
* @param {string} url
* @returns {any}
*/
module.exports = async (url, context) => {

  let currentDate = new Date();
  currentDate.setUTCHours(currentDate.getHours() - 1, 59, 59, 999);
  let today = new Date().setUTCHours(0, 0, 0, 0);
  let lastWeek = new Date(today - (7 * 24 * 60 * 60 * 1000)).getTime(); // midnight 7 days ago

  let filter = {
    KeyConditionExpression: "#endpoint = :url and #timestamp BETWEEN :lastWeek AND :currentTime",
    ExpressionAttributeNames:{
        "#endpoint": "endpoint",
        "#timestamp": "timestamp",
    },
    ExpressionAttributeValues: {
        ":url": url,
        ":lastWeek": lastWeek,
        ":currentTime": currentDate.getTime(),
    },
  };

  return await db.query(filter);

};
