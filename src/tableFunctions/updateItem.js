import { DynamoDB } from 'aws-sdk';
import errorMsg from '../components/errorMsg';

async function updateItemInDB(event, docClient) {
  return new Promise((resolve) => {
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
    // eslint-disable-next-line consistent-return
    const dbResult = docClient.update(params, (err) => {
      if (err) {
        errorMsg(err);
      }
    });

    console.log(dbResult);
    resolve(params);
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
        message: 'The movie with the selected keys has been updated as follow:-',
        input: await result,
      },
      null,
      2),
    });
  } catch (err) {
    return ({
      statusCode: 400,
      body: JSON.stringify({
        message: 'The movie couldn\'t be updated for the following reason:-',
        input: err,
      },
      null,
      2),
    });
  }
};
