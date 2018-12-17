'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = (data) => {
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {"id": data.id},
        UpdateExpression: "set #fld = :vari",
		ExpressionAttributeValues: {
		    ":ind" : data.index
		},
		ExpressionAttributeNames: {},
		ReturnValues: "ALL_NEW"
    };

    if (data.status) {
    	params.ExpressionAttributeNames["#fld"] = "status";
    	params.ExpressionAttributeValues[":vari"] = data.status;
    } else if (data.firstName) {
    	params.ExpressionAttributeNames["#fld"] = "firstName";
    	params.ExpressionAttributeValues[":vari"] = data.firstName;
    } else if (data.lastName) {
    	params.ExpressionAttributeNames["#fld"] = "lastName";
    	params.ExpressionAttributeValues[":vari"] = data.lastName;
    } else if (data.sirName) {
    	params.ExpressionAttributeNames["#fld"] = "sirName";
    	params.ExpressionAttributeValues[":vari"] = data.sirName;
    } else if (data.email) {
    	params.ExpressionAttributeNames["#fld"] = "email";
    	params.ExpressionAttributeValues[":vari"] = data.email;
    } else if (data.birthday) {
    	params.ExpressionAttributeNames["#fld"] = "birthday";
    	params.ExpressionAttributeValues[":vari"] = data.birthday;
    } else if (data.crossingDate) {
    	params.ExpressionAttributeNames["#fld"] = "crossingDate";
    	params.ExpressionAttributeValues[":vari"] = data.crossingDate;
    }

    return dynamoDb.update(params).promise().then(result => {
    	console.log("looking at the data for update brother: ", result);
    	return result.Item;
    });
};

// Updates the field of a bro
// Right now can only update one at a time. Should be changed so that if it recieves firstName and lastName
// for example, it can change both with one request