'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// Resolver to remove brother

module.exports = (data) => {
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {"id": data.id},
		ReturnValues: "ALL_OLD"
    };
    return dynamoDb.delete(params).promise().then(result => {
    	return result.Item;
    });
};