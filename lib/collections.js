import { Mongo } from 'meteor/mongo';

// 갤러리, 작가, 큐레이터, 행사
export const Gallary    =   new Mongo.Collection('GALLARY');        // 겔러리
export const Atwrk      =   new Mongo.Collection('ATWRK');          // 작품
export const Atst       =   new Mongo.Collection('ATST');           // 작가
export const Pick       =   new Mongo.Collection('PICK');           // 큐레이터 픽
export const Evnt       =   new Mongo.Collection('EVNT');           // 전시 및 행사


// 유저 및 회원
export const BsnsMber   =   new Mongo.Collection('BSNSMBER');       // 기업회원
export const Mber       =   new Mongo.Collection('MBER');           // 일반회원
export const SnsMber    =   new Mongo.Collection('SNSMBER');        // SNS회원
export const ORDER      =   new Mongo.Collection('ORDER')           // 주문/배송


// 배너 및 퀵메뉴 공지사항
export const Banr       =   new Mongo.Collection('BANR');           // 배너
export const Quick      =   new Mongo.Collection('QUICK');          // 퀵메뉴
export const Notice     =   new Mongo.Collection('NOTICE');         // 공지사항
export const FAQ        =   new Mongo.Collection('FAQ');            // FAQ 
export const Cmmnc      =   new Mongo.Collection('CMMNC');          // 커뮤니케이션

// file
export const Files      =   new Mongo.Collection('fs.files');        // 파일 컬렉션
export const Chunk      =   new Mongo.Collection('fs.chunks');       // 청크 파일
