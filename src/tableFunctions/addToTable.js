const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: '1234',
  secretAccessKey: '5678',
  endpoint: 'http://localhost:8000',
});

const addToTable = async (event) => {
  const docClient = new AWS.DynamoDB.DocumentClient();

  console.log('Importing movies into DynamoDB. Please wait.');

  const allMovies = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/moviedata.json')), 'utf8');
  allMovies.forEach((movie) => {
    const params = {
      TableName: 'Movies',
      Item: {
        year: movie.year, // The year number
        title: movie.title, // The title of string type
        info: movie.info, // An object of any info
      },
    };

    docClient.put(params, (err) => {
      if (err) {
        console.error('Unable to add movie ', movie.title, '. Error JSON:', JSON.stringify(err, null, 2));
      } else {
        console.log('PutItem succeeded: ', movie.title);
      }
    });
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'addToTable function has been executed...',
      input: event,
    },
    null,
    2),
  };
};

module.exports = {
  handler: addToTable,
};
