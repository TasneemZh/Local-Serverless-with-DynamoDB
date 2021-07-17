import { config, DynamoDB } from 'aws-sdk';
import { readFile } from 'fs/promises';

// Lambda functions need aws permissions in order to use the database.
config.update({
  region: 'us-east-1',
  accessKeyId: '1234',
  secretAccessKey: '5678',
  endpoint: 'http://localhost:8000',
});

async function addFileToDB(docClient, allMovies) {
  return new Promise((res) => {
    const params = [];
    const movieTitles = [];
    allMovies.forEach((movie) => {
      params.push({
        TableName: 'Movies',
        Item: {
          year: movie.year, // Movie year of production
          title: movie.title, // Movie name
          info: movie.info, // An object of any information
        },
      });
    });

    // Add movie parameters to the table including the year, title, and info
    const promise = new Promise((resolve, reject) => {
      for (let i = 0; i < params.length; i += 1) {
        movieTitles.push(params[i].Item.title);
        docClient.put(params[i], (err) => {
          if (err) {
            reject(err);
          } else if (i === params.length - 1) { // Last item
            resolve(movieTitles);
          }
        });
      }
    });

    promise.catch(() => {}); // To swallow all errors
    res(promise); // promise.Item.title
  });
}

// eslint-disable-next-line import/prefer-default-export
export const handler = async () => {
  try {
    // Have the propability of not being created yet
    const docClient = new DynamoDB.DocumentClient();
    const moviesFile = await readFile('./src/data/moviedata.json', 'utf-8');
    const allMovies = JSON.parse(moviesFile);
    const result = await addFileToDB(docClient, allMovies);
    return ({
      statusCode: 200,
      body: JSON.stringify({
        message: 'New Movies have been added, and they have the following titles:-',
        input: await result,
      },
      null,
      2),
    });
  } catch (err) {
    return ({
      statusCode: 400,
      body: JSON.stringify({
        message: 'The movies couldn\'t be added for the following reason:-',
        input: err.message,
      },
      null,
      2),
    });
  }
};
