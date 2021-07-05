'use strict'

module.exports.mochaExample = async (event, context) => {
  let bodyObj = JSON.parse(event.body)
  console.log(bodyObj.parameter) // Should conosle.log the parameter inside the test function if everything is configured correctly
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: bodyObj.parameter // Nothing will appear through moch command and thus used console.log
    })
  }
}
