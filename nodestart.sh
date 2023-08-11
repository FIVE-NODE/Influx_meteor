# NORMAL SETTING
export METEOR_SETTINGS='{"tempPath" : "/home/my/atwrk-image/temps/", "imagesPath" : "/home/my/atwrk-image/images/", "delPath" : "/home/my/atwrk-image/"}'
export PORT=16005
export MONGO_URL='mongodb://admin:SJLab5n$@34.145.117.48:27017/INFLUX'
export ROOT_URL='http://34.145.117.48:16005'

# forever start -w -o /app/chat/logs/client/app.log app_chat.js

nohup node --port 16005 &
