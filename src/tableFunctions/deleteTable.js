var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-east-1",
    accessKeyId: "1234",
    secretAccessKey: "5678",
    endpoint: "http://localhost:8000"
  });

const deleteTable = async (event) => {
var dynamodb = new AWS.DynamoDB()

var params = {
    TableName : "Movies"
};

dynamodb.deleteTable(params, function(err, data) {
    if (err) {
        console.error("Error! Unable to delete table...")
    } else {
        console.log("Deleted table successfully!")
    }
});

return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'deleteTable function has been executed...'
    },
    null,
    2
    )
  }
}

module.exports = {
handler: deleteTable
}