module.exports.mochaExample = async (event) => {
  const bodyObj = JSON.parse(event.body);
  // Should conosle.log the parameter inside the test function if everything is configured correctly
  console.log(bodyObj.parameter);
  return {
    statusCode: 200,
    body: JSON.stringify({
      // Nothing will appear through moch command and thus used console.log
      message: bodyObj.parameter,
    }),
  };
};
