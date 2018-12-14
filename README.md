# hypebot
serverless backend for odphi hypebot

This project was rebuilt to use [Serverless](https://serverless.com/) as a backend so we can have multiple applications interacting with hypebot. It is currently deployed using AWS Lambdas, DynamoDB, S3, EC2, API Gateway, and IAM, but can use any cloud service. 

As of right now, hypebot interacts with users in groupme groups and it's database can be altered from the [task management react app](https://github.com/rojaswestall/hypebot-dashboard) or from directly within those groupme groups.

To see how hypebot was originally built using a standalone server deployed to Heroku with MongoDB, visit the [repo](https://github.com/rojaswestall/odphi-hypebot).

## Do it yourself

To deploy your own hypebot, clone the repository, install the AWSCLI, install Serverless, make your own [groupme bot](https://dev.groupme.com), and run the following commands after configuring your own serverless and AWS accounts.

```
aws configure
export BOT_ID = XXXXXXXXXXXXXXXXXXXXXXXX
```

Set the botname in configVars.yml to be the same one that you used to make the groupme bot.

```
serverless deploy
```
