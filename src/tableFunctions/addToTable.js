const AWS = require('aws-sdk');
const { readFileSync } = require('fs');
const path = require('path');

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: '1234',
  secretAccessKey: '5678',
  endpoint: 'http://localhost:8000',
});

async function addToDB(allMovies, docClient) {
  const movieTitles = [];
  return new Promise((resolve) => {
    allMovies.forEach((movie) => {
      const params = {
        TableName: 'Movies',
        Item: {
          year: movie.year, // Movie year of production
          title: movie.title, // Movie name
          info: movie.info, // An object of any information
        },
      };
      // Add movie parameters to the table including the year, title, and info
      docClient.put(params, (err) => {
        if (err) {
          throw err;
        }
      });
      movieTitles.push(movie.title);
    });
    resolve(movieTitles);
  }).catch((err) => {
    throw new Error(`Well, errors can happen. ${err}`);
  });
}

const addToTable = async () => {
  try {
    // Have the propability of not being created yet
    const docClient = new AWS.DynamoDB.DocumentClient();
    const allMovies = JSON.parse(readFileSync(path.resolve(__dirname, '../data/moviedata.json')), 'utf8');

    return ({
      statusCode: 200,
      body: JSON.stringify({
        message: 'New Movies have been added, and they have the following titles:-',
        input: await addToDB(allMovies, docClient),
      },
      null,
      2),
    });
  } catch (err) {
    throw new Error(`Well, errors can happen. ${err}`);
  }
};

module.exports = {
  handler: addToTable,
};
