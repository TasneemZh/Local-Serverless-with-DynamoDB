/* eslint linebreak-style: ["error", "windows"] */
const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: '1234',
  secretAccessKey: '5678',
  endpoint: 'http://localhost:8000',
});

const addUserInput = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  const newItem = {
    'year': '', // The year number
    'title': '', // The title of string type
    'info': '' // An object of any info
  };

  await dynamodb.put({
    TableName: 'Movies',
    Item: newItem,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'addUserInput function has been executed...',
      input: JSON.parse(event.body),
    },
    null,
    2),
  };
};

module.exports = {
  handler: addUserInput,
};