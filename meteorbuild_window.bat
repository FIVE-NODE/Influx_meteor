for /f %%i in ('powershell -c "get-date -format yyyyMMdd_HHmmss"') do set DATETIME=%%i
@REM SungShin live server
@REM set path=C:\Users\patrick\Desktop\meteorbuild\shungShin_live_server

@REM MediIot live server path
set path=C:\Users\patrick\Desktop\meteorbuild\art_work


@REM set sPath=C:\Users\patrick\Desktop\FiveNode\Five_node_new_chat\fivenode_talk_client\chat

@REM echo '### 1. previous bundle backup ###'
@REM ren %path%\bundle bundle_%DATETIME%

@REM echo '### 2. meteor build start ###'
@REM cd %sPath%
@REM meteor build --directory %path% --architecture os.linux.x86_64
@REM meteor build --directory C:\Users\patrick\Desktop\meteorbuild\mediiot_live_server --architecture os.linux.x86_64

@REM SungShin live server
@REM meteor build --directory C:\Users\patrick\Desktop\meteorbuild\art_work --architecture os.linux.x86_64

echo '### 3. copy node start/stop shell ###'
@REM copy .\nodestart.sh %path%\bundle\
@REM copy .\nodestop.sh %path%\bundle\

@REM echo '### 4. npm install ###'
@REM cd %path%\bundle\programs\server
@REM meteor npm install

echo '### 5. make tar file ###'
cd %path%\bundle
copy main.js art_work.js
@REM tar -cvf client_app_chat.tar
@REM tar -xvf bundle.tar

echo '### 6. meteor build complete ###'
