import { DynamoDB } from 'aws-sdk';
import awsPermissions from '../authentication/awsPermissions';

awsPermissions();

async function createTableInDB(dynamoDB) {
  return new Promise((res) => {
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

    const promise = new Promise((resolve, reject) => {
      dynamoDB.createTable(params, (err) => {
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
export const handler = async () => {
  try {
    // Lambda functions need aws permissions in order to use the database.
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
        input: err.message,
      },
      null,
      2),
    });
  }
};
