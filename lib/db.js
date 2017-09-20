const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.PUBLIC_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  region: process.env.AWS_REGION
});

const DynamoDB = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();
const table = process.env.TABLE_NAME;

const addItem = function(item) {

  return new Promise((resolve, reject) => {

    let params = {
        TableName: table,
        Item: item
    };

    docClient.put(params, function(err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });

  });
};


const query = function(filter) {

  return new Promise((resolve, reject) => {

    let params = {
      TableName: table
    };

    params = Object.assign({}, params, filter)

    docClient.query(params, function(error, data) {
      if (error) {
        reject(error);
      }
      resolve(data);
    });

  });
};

exports.addItem = addItem;
exports.query = query;
