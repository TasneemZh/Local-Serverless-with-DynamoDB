import { DynamoDB } from 'aws-sdk';
import awsPermissions from '../authentication/awsPermissions';

awsPermissions();

async function createTableInDB(dynamoDB) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: 'Movies',
      /* both year and title are keys for any movie object in the DB. That
         means changing at least one of the keys creates a new movie object */
      KeySchema: [
        { AttributeName: 'year', KeyType: 'HASH' }, // partition key
        { AttributeName: 'title', KeyType: 'RANGE' }, // sort key
      ],
      AttributeDefinitions: [
        { AttributeName: 'year', AttributeType: 'N' }, // integer (number) type
        { AttributeName: 'title', AttributeType: 'S' }, // string type
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 10, // number of accesses for reading per second
        WriteCapacityUnits: 10, // number of accesses for writing per second
      },
    };

    dynamoDB.createTable(params, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(params.TableName);
      }
    });
  });
}

// eslint-disable-next-line import/prefer-default-export
export const handler = async () => {
  try {
    const dynamoDB = new DynamoDB();
    const result = await createTableInDB(dynamoDB);
    return ({
      statusCode: 200,
      body: JSON.stringify({
        message: 'Created successfully the table with the following name:-',
        input: await result,
      },
      null,
      2),
    });
  } catch (err) {
    return ({
      statusCode: 400,
      body: JSON.stringify({
        message: 'Error! Couldn\'t create table for the following reason:-',
        input: err.message,
      },
      null,
      2),
    });
  }
};
