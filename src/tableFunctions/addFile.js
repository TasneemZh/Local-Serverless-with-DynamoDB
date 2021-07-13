import { DynamoDB } from 'aws-sdk';
import { readFileSync } from 'fs';
import errorMsg from '../components/errorMsg';

async function addFileToDB(docClient, allMovies) {
  return new Promise((resolve) => {
    const movieTitles = [];
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
  });
}

// eslint-disable-next-line import/prefer-default-export
export const addFile = async () => {
  try {
    // Have the propability of not being created yet
    const docClient = new DynamoDB.DocumentClient();
    const allMovies = JSON.parse(readFileSync('./src/data/moviedata.json'), 'utf8');
    const result = addFileToDB(docClient, allMovies);
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
        input: err,
      },
      null,
      2),
    });
  }
};
