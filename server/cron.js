import { Meteor } from 'meteor/meteor';

import { SyncedCron } from 'meteor/littledata:synced-cron';

// meteor batch 
SyncedCron.add({
    name : 'TempsdeleteImg',
    schedule(parser) {
        // 배치 시간 설정
        // return parser.text('every 1 day at 03:30 am');
        return parser.text('every 1 day at 03:30 am');
    },
    job() {
        // 파일 삭제
        console.log('배치 시작 ============== ');
        Meteor.call('tempDelImgFile', '', (error, result) => {
            if(error) {
                console.error(error.reason);
            } else {
                console.log(result);
            }
        });
        console.log('배치 종료 ============== ');
    }
});

SyncedCron.start();