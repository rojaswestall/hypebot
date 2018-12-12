'use strict';
const axios = require('axios');

const client = axios.create({
  baseURL: 'https://api.groupme.com'
});

const request = function(options) {
	const onSuccess = function(response) {
		console.log('Request Successful!', response);
		return response.data;
	}

	const onError = function(error) {
		console.error('Request Failed:', error.config);

		if (error.response) {
			// Request was made but server responded with something
			// other than 2xx
			console.error('Status:',  error.response.status);
			console.error('Data:',    error.response.data);
			console.error('Headers:', error.response.headers);
		} else {
			// Something else happened while setting up the request
			// triggered the error
			console.error('Error Message:', error.message);
		}

		return Promise.reject(error.response || error.message);
	}

	return client(options).then(onSuccess).catch(onError);
}

const sendMessage = function(message) {
	const botId = process.env.BOT_ID;
	request({
		method: 'post',
		url: '/v3/bots/post',
		data: JSON.stringify({
			text: message,
			bot_id: botId
		})
	}).then((response) => {
		console.log(response);
	})
}

module.exports = sendMessage;