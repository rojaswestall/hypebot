'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid');

module.exports = (data) => {
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {"id": data.id},
        UpdateExpression: "set #tsks = list_append(#tsks, :newtask), currentTasksNum = currentTasksNum + :counter, totalTasks = totalTasks + :counter",
        ExpressionAttributeNames: {
            "#tsks" : "tasks"
        },
        ExpressionAttributeValues: {
            ":newtask" : [{
                description: data.description,
                originalDueDate: data.dueDate,
                dueDate: data.dueDate,
                dateAssigned: Date.now(),
                partners: data.partners,
                notes: data.notes
            }],
            ":counter" : 1
        },
        ReturnValues: "ALL_NEW"
    };
    return dynamoDb.update(params).promise()
        .then(result => {
            return result.Attributes;
        })
};