import { DynamoDB } from 'aws-sdk';
import awsPermissions from '../authentication/awsPermissions';

awsPermissions();

async function addInputToDB(event, docClient) {
  return new Promise((resolve, reject) => {
    const { year, title, info } = JSON.parse(event.body);

    // check the user-input of the key
    const keyParams = {
      TableName: 'Movies',
      /* the year and title parameters are keys and thus should
     match one of the movies that are already in the DB */
      Key: {
        year,
        title,
      },
    };

    // find a movie with the same key object
    docClient.get(keyParams, (err, data) => {
      if (err) {
        reject(err);
      } else if (JSON.stringify(data) !== '{}') {
        reject(new Error('There is a movie with the same keys in the database'));
      }
    });

    const params = {
      TableName: 'Movies',
      Item: {
        year, // Movie year of production - of N type (Integer/Number)
        title, // Movie name - of S type (String)
        info, // An object of any information - of {} type (Object)
      },
    };

    // Add movie parameters to the table including the year, title, and info
    docClient.put(params, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(params);
      }
    });
  });
}

// eslint-disable-next-line import/prefer-default-export
export const handler = async (event) => {
  try {
    const docClient = new DynamoDB.DocumentClient();
    const result = await addInputToDB(event, docClient);
    return ({
      statusCode: 200,
      body: JSON.stringify({
        message: 'A new movie based on your inputs has been added as follows:-',
        input: await result,
      },
      null,
      2),
    });
  } catch (err) {
    return ({
      statusCode: 400,
      body: JSON.stringify({
        message: 'The movie couldn\'t be added for the following reason:-',
        input: err.message,
      },
      null,
      2),
    });
  }
};
