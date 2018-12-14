'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// Resolver to remove brother

module.exports = (id) => {
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: { id }
    };
    return dynamoDb.delete(params).promise()
};