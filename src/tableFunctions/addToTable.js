const AWS = require('aws-sdk');
const { readFileSync } = require('fs');
const path = require('path');

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: '1234',
  secretAccessKey: '5678',
  endpoint: 'http://localhost:8000',
});

async function errorMsg(err) {
  console.error(`Well, errors can happen. ${err}`);
}

async function addToDB(allMovies, docClient) {
  const movieTitles = [];
  const p = new Promise((resolve) => {
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
          errorMsg(err);
        }
      });
      movieTitles.push(movie.title);
    });
    resolve(movieTitles);
  }); // The try/catch block will catch any Promis error, so no need for another catch here

  return p;
}

const addToTable = async (event) => {
  let docClient; let allMovies; let msg; let
    codeNum; let result;

  try {
    // Have the propability of not being created yet
    docClient = new AWS.DynamoDB.DocumentClient();
    allMovies = JSON.parse(readFileSync(path.resolve(__dirname, '../data/moviedata.json')), 'utf8');
    codeNum = 200;
    msg = 'New Movies have been added, and they have the following titles:-';
    result = await addToDB(allMovies, docClient);
  } catch (err) {
    errorMsg(err);
    codeNum = 400;
    msg = 'Movies couldn\'t be added to the database for some reason...';
    result = event;
  }

  return ({
    statusCode: codeNum,
    body: JSON.stringify({
      message: msg,
      input: await result,
    },
    null,
    2),
  });
};

module.exports = {
  handler: addToTable,
};
