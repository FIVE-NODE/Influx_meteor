# NORMAL SETTING
export METEOR_SETTINGS='{"tempPath" : "/app/atwrk-image/temps/", "imagesPath" : "/app/atwrk-image/images/", "delPath" : "/app/atwrk-image/"}'
export PORT=16005
export MONGO_URL='mongodb://SJLab:SJLab5n$@34.145.117.48:27017/INFLUX'
export MONGO_OPLOG_URL='mongodb://admin:SJLab5n$@34.145.117.48:27017/local?authSource=admin'
# export MONGO_URL='mongodb://admin:admin@210.92.49.162:27017/INFLUX'
# export MONGO_OPLOG_URL='mongodb://admin:SJLab5n$@210.92.49.162:27017/local?authSource=admin'
export ROOT_URL='http://34.145.117.48:16005'

# forever start -w -o /app/chat/logs/client/app.log app_chat.js

# meteor --port 16005

nohup node --port 16005 &