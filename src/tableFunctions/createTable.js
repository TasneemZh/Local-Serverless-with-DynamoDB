import { config, DynamoDB } from 'aws-sdk';
import errorMsg from '../components/errorMsg';

/* Lambda functions need aws permissions in order to use the database.
   It was proven that it is enough to give the permissions (by
   connecting Lambda functions to a valid security token) for creating the
   table only, and all the operations on it would be authenticated */
config.update({
  region: 'us-east-1',
  accessKeyId: '1234',
  secretAccessKey: '5678',
  endpoint: 'http://localhost:8000',
});

async function createTableInDB(dynamoDB) {
  return new Promise((resolve) => {
    const params = {
      TableName: 'Movies',
      KeySchema: [
        { AttributeName: 'year', KeyType: 'HASH' }, // Partition key
        { AttributeName: 'title', KeyType: 'RANGE' }, // Sort key
      ],
      AttributeDefinitions: [
        { AttributeName: 'year', AttributeType: 'N' }, // Integer (Number) type
        { AttributeName: 'title', AttributeType: 'S' }, // String type
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 10, // Number of accesses for reading per second
        WriteCapacityUnits: 10, // Number of accesses for writing per second
      },
    };
    dynamoDB.createTable(params, (err) => {
      if (err) {
        errorMsg(err);
      }
    });
    resolve(params);
  });
}

// eslint-disable-next-line import/prefer-default-export
export const createTable = async () => {
  try {
    const dynamoDB = new DynamoDB();
    const result = await createTableInDB(dynamoDB);
    return ({
      statusCode: 200,
      body: JSON.stringify({
        message: 'Created table successfully with the following paramaters:-',
        input: await result,
      },
      null,
      2),
    });
  } catch (err) {
    return ({
      statusCode: 400,
      body: JSON.stringify({
        message: 'Couldn\'t create table for the following reason:-',
        input: err,
      },
      null,
      2),
    });
  }
};
