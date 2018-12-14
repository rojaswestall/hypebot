'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = (id) => {
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: { id }
    };
    return dynamoDb.get(params).promise()
        .then(r => r.Item);
};