import { DynamoDB } from 'aws-sdk';
import errorMsg from '../components/errorMsg';

async function deleteTableInDB() {
  return new Promise((resolve) => {
    const dynamodb = new DynamoDB();
    const params = {
      TableName: 'Movies',
    };
    dynamodb.deleteTable(params, (err) => {
      if (err) {
        errorMsg(err);
      }
    });
    resolve(params);
  });
}

// eslint-disable-next-line import/prefer-default-export
export const deleteTable = async () => {
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
        input: err,
      },
      null,
      2),
    });
  }
};
