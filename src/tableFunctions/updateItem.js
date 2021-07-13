import { config, DynamoDB } from 'aws-sdk';

// Lambda functions need aws permissions in order to use the database.
config.update({
  region: 'us-east-1',
  accessKeyId: '1234',
  secretAccessKey: '5678',
  endpoint: 'http://localhost:8000',
});

async function updateItemInDB(event, docClient) {
  return new Promise((res) => {
    const { year, title, info } = JSON.parse(event.body);
    const params = {
      TableName: 'Movies',
      /* The year and title parameters are keys and thus should
        match one of the movies that are already in the DB */
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

    const promise = new Promise((resolve, reject) => {
      docClient.update(params, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(params);
        }
      });
    });

    promise.catch(() => {}); // To swallow all errors
    res(promise);
  });
}

// eslint-disable-next-line import/prefer-default-export
export const updateItem = async (event) => {
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
    console.log(err);
    return ({
      statusCode: 400,
      body: JSON.stringify({
        message: 'The movie couldn\'t be updated for the following reason:-',
        input: err.message,
      },
      null,
      2),
    });
  }
};
