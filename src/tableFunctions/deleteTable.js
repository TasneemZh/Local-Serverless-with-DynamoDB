import { config, DynamoDB } from 'aws-sdk';

config.update({
  region: 'us-east-1',
  accessKeyId: '1234',
  secretAccessKey: '5678',
  endpoint: 'http://localhost:8000',
});

// eslint-disable-next-line import/prefer-default-export
export const handler = async () => {
  const dynamodb = new DynamoDB();

  const params = {
    TableName: 'Movies',
  };

  dynamodb.deleteTable(params, (err) => {
    if (err) {
      console.error('Error! Unable to delete table...');
    } else {
      console.log('Deleted table successfully!');
    }
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'deleteTable function has been executed...',
    },
    null,
    2),
  };
};
