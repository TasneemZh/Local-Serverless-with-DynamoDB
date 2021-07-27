'use strict'

module.exports.exampleFunction = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Success!'
    })
  }
}