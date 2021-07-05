var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-east-1",
    accessKeyId: "1234",
    secretAccessKey: "5678",
    endpoint: "http://localhost:8000"
  });

const updateItem = async (event) => {
var dynamodb = new AWS.DynamoDB.DocumentClient()

const { year, title, info } = JSON.parse(event.body);

await dynamodb.update({
    TableName: "Movies",
    Key:{
        "year": year,
        "title": title
    },
    UpdateExpression: "set info=:info",
    ExpressionAttributeValues:{
        ":info": info
    },
    ReturnValues:"UPDATED_NEW"
}).promise()

return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'updateItem function has been executed...',
      input: JSON.parse(event.body)
    },
    null,
    2
    )
  }
}

module.exports = {
    handler: updateItem
  }