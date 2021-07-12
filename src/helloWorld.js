// eslint-disable-next-line import/prefer-default-export
export const handler = async (event) => ({
  statusCode: 200,
  body: JSON.stringify({
    message: 'Hello World!',
    input: event,
  },
  null,
  2),
});
