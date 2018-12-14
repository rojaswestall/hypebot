To act as if GroupMe was sending our serverless endpoint a message (as if we were someone in the group chat) you can use curl:
```
curl -d '{"text": "whatever message you want to send", "name": "who ever you want to act as though you're receiving the message from"}' -H "Content-Type: application/json" -X POST https://orc722is9j.execute-api.us-east-1.amazonaws.com/dev/handleMessage
```

This is what a standard message will look like when groupme sends it to serverless:
```
body: '{"attachments":[],"avatar_url":"https://i.groupme.com/1090x1090.jpeg.2439d2b5b56947588772e0dcb8018810","created_at":1544626900,"group_id":"36851875","id":"154462690079386792","name":"Guajiro","sender_id":"20541471","sender_type":"user","source_guid":"BD562DBF-7D3F-4D94-9B24-3459C9900684","system":false,"text":"Message","user_id":"20541471"}'
```

Helpful notes/reminders on serverless stuff:

To see logs for a specific function:
```
serverless logs -f
```

To see on the online dashboard;
```
serverless login
```

To deploy:
```
serverless deploy
```

To see service information (like endpoints, api keys, functions, and layers):
```
serverless info
```

To only redeploy certain functions of the code use:
```
serverless deploy function -f myFuncName
```