import { config, DynamoDB } from 'aws-sdk';

config.update({
  region: 'us-east-1',
  accessKeyId: '1234',
  secretAccessKey: '5678',
  endpoint: 'http://localhost:8000',
});

async function addInputToDB(docClient) {
  return new Promise((resolve) => {
    const params = {
      TableName: 'Movies',
      Item: {
        year: '', // Movie year of production
        title: '', // Movie name
        info: '', // An object of any information
      },
    };

    // Add movie parameters to the table including the year, title, and info
    docClient.put(params, (err) => {
      if (err) {
        throw err;
      }
    });
    resolve(params);
  });
}

// eslint-disable-next-line import/prefer-default-export
export const handler = async () => {
  try {
    const docClient = new DynamoDB.DocumentClient();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'New movie based on your inputs has been added:-',
        input: await addInputToDB(docClient),
      },
      null,
      2),
    };
  } catch (err) {
    throw new Error(`Well, errors can happen. ${err}`);
  }
};
