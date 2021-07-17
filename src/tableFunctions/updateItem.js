import { DynamoDB } from 'aws-sdk';
import awsPermissions from '../authentication/awsPermissions';

awsPermissions();

async function updateItemInDB(event, docClient) {
  return new Promise((resolve, reject) => {
    // take user-input from the body
    const { year, title, info } = JSON.parse(event.body);

    // check the user-input key object
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
      } else if (JSON.stringify(data) === '{}') {
        reject(new Error('The keys don\'t match any of the data in the database'));
      }
    });

    // assign the movie of this key object with the new info
    const params = {
      TableName: 'Movies',
      Key: {
        year,
        title,
      },
      UpdateExpression: 'set info=:info',
      ExpressionAttributeValues: {
        ':info': info,
      },
      ReturnValues: 'UPDATED_NEW',
    };

    // update the movie
    docClient.update(params, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          TableName: 'Movies',
          Key: {
            year,
            title,
          },
          info,
        });
      }
    });
  });
}

// eslint-disable-next-line import/prefer-default-export
export const handler = async (event) => {
  try {
    const docClient = new DynamoDB.DocumentClient();
    const result = await updateItemInDB(event, docClient);
    return ({
      statusCode: 200,
      body: JSON.stringify({
        message: 'The movie with the selected keys has been updated as follows:-',
        input: await result,
      },
      null,
      2),
    });
  } catch (err) {
    return ({
      statusCode: 400,
      body: JSON.stringify({
        message: 'Error! The movie couldn\'t be updated for the following reason:-',
        input: err.message,
      },
      null,
      2),
    });
  }
};
