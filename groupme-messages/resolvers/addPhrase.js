'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid');

module.exports = (data) => {
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {"id": data.id},
        UpdateExpression: "set #phrs = list_append(#phrs, :newphrase)",
        ExpressionAttributeNames: {
            "#phrs" : "phrases"
        },
        ExpressionAttributeValues: {
            ":newphrase" : [data.phrase]
        },
        ReturnValues: "ALL_NEW"
    };
    return dynamoDb.update(params).promise().then(result => {
            return result.Attributes;
        });
};