'use strict';
const sendMessage = require('./actions/sendMessage');
const { graphql } = require('graphql');
const schema = require('./schema');

module.exports.handleMessage = (event, context, callback) => {
	console.log(event);
	var body = JSON.parse(event.body);
	if (body.name !== "Sample Bot" && body.name !== process.env.BOT_NAME) {
		sendMessage("a test message from the server");
	}
  // const response = {
  //   statusCode: 200,
  //   headers: {
  //   	'Access-Control-Allow-Origin': '*',
  //   	'Access-Control-Allow-Credentials': true
  //   },
  //   body: JSON.stringify({ message: "Hello World!" }),
  // };

  callback(null);
};

module.exports.queryBrothers = (event, context, callback) => {
    graphql(schema, event.body)
        .then(result => callback(null, {statusCode: 200, body: JSON.stringify(result)}))
        .catch(callback);
};