import { config, DynamoDB } from 'aws-sdk';

// Lambda functions need aws permissions in order to use the database.
config.update({
  region: 'us-east-1',
  accessKeyId: '1234',
  secretAccessKey: '5678',
  endpoint: 'http://localhost:8000',
});

async function addInputToDB(event, docClient) {
  return new Promise((res) => {
    const body = JSON.parse(event.body);
    const params = {
      TableName: 'Movies',
      Item: {
        year: body.year, // Movie year of production - of N type (Integer/Number)
        title: body.title, // Movie name - of S type (String)
        info: body.info, // An object of any information - of {} type (Object)
      },
    };

    // Add movie parameters to the table including the year, title, and info
    const promise = new Promise((resolve, reject) => {
      docClient.put(params, (err) => {
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
export const handler = async (event) => {
  try {
    const docClient = new DynamoDB.DocumentClient();
    const result = await addInputToDB(event, docClient);
    return ({
      statusCode: 200,
      body: JSON.stringify({
        message: 'A new movie based on your inputs has been added:-',
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
