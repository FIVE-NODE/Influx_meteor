# NORMAL SETTING
export PORT=16005
export MONGO_URL='mongodb://admin:admin@210.92.49.162:27017/INFLUX'
export ROOT_URL='http://210.92.49.162:16005'

# forever start -w -o /app/chat/logs/client/app.log app_chat.js

nohup node --port 16005 &
