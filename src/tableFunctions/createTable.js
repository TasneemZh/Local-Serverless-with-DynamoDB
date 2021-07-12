import { config, DynamoDB } from 'aws-sdk';

config.update({
  region: 'us-east-1',
  accessKeyId: '1234',
  secretAccessKey: '5678',
  endpoint: 'http://localhost:8000',
});

// eslint-disable-next-line import/prefer-default-export
export const createTable = async (event) => {
  const dynamodb = new DynamoDB();

  const params = {
    TableName: 'Movies',
    KeySchema: [
      { AttributeName: 'year', KeyType: 'HASH' }, // Partition key
      { AttributeName: 'title', KeyType: 'RANGE' }, // Sort key
    ],
    AttributeDefinitions: [
      { AttributeName: 'year', AttributeType: 'N' },
      { AttributeName: 'title', AttributeType: 'S' },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 10, // Number of accesses for reading per second
      WriteCapacityUnits: 10, // Number of accesses for writing per second
    },
  };

  dynamodb.createTable(params, (err) => {
    if (err) {
      console.error('Error! Unable to create table...');
    } else {
      console.log('Created table successfully!');
    }
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'createTable function has been executed...',
      input: event,
    },
    null,
    2),
  };
};
