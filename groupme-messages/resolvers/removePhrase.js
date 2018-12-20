'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = (data) => {
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {"id": data.id},
        UpdateExpression: "remove #phrs[" + data.index + "]",
		ExpressionAttributeNames: {
		    "#phrs" : "phrases"
		},
		ReturnValues: "ALL_NEW"
    };
    return dynamoDb.update(params).promise().then(result => {
        return result.Attributes;
    });
};