import { DynamoDB } from 'aws-sdk';
import awsPermissions from '../authentication/awsPermissions';

awsPermissions();

async function deleteTableInDB() {
  return new Promise((res) => {
    const dynamodb = new DynamoDB();
    const params = {
      TableName: 'Movies',
    };

    const promise = new Promise((resolve, reject) => {
      dynamodb.deleteTable(params, (err) => {
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
    const result = await deleteTableInDB();
    return ({
      statusCode: 200,
      body: JSON.stringify({
        message: 'Deleted table successfully. It has the following name:-',
        input: await result,
      },
      null,
      2),
    });
  } catch (err) {
    return ({
      statusCode: 400,
      body: JSON.stringify({
        message: 'Couldn\'t delete the table for the following reason:-',
        input: err.message,
      },
      null,
      2),
    });
  }
};
