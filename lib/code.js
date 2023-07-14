import { Meteor } from 'meteor/meteor';

// key 가 있을 겨웅 해당하는 Key 만 가져온다.
// key 가 없을 경우 해당하는 그룹에 모든 코드를 가져온다.
Meteor.codes = {
    MEDIUM : function(key) {
        // 원화 미디움
        if(key === undefined || key === null || key === '') return codeToList(MEDIUM);
        else return MEDIUM[key];
    },
    STYLE_1 : function(key) {
        // 스타일 1
        if(key === undefined || key === null || key === '') return codeToList(STYLE_1);
        else return STYLE_1[key];
    },
    STYLE_2 : function(key) {
        // 스타일 2
        if(key === undefined || key === null || key === '') return codeToList(STYLE_2);
        else return STYLE_2[key];
    },
    MATERIAL : function(code) {
        // 재료
        if(code === undefined || code === null || code === '') return codeToList(MATERIAL);
        else {
            var res = {};
            Object.keys(MATERIAL).find(name => {
                if(MATERIAL[name].code === code) res = MATERIAL[name];
            });
            return res;
        }
    },
    BASE : function(code) {
        // 디지털 판화 용 베이스
        if(code === undefined || code === null || code === '') return codeToList(BASE);
        else {
            var res = {};
            Object.keys(BASE).find(name => {
                if(BASE[name].code === code) res = BASE[name];
            });
            return res;
        }
    },
    BUSINESS : function(key) {
        // 비즈니스 회원가입시 타입
        if(key === undefined || key === null || key === '') return codeToList(BUSINESS);
        else return BUSINESS[key];
    },
    SNS_TYPE : function(key) {
        // 회원가입시 타입
        if(key === undefined || key === null || key === '') return codeToList(SNS_TYPE);
        else return SNS_TYPE[key];
    },
    WITHDRAWAL : function(key) {
        if(key === undefined || key === null || key === '') return codeToList(WITHDRAWAL);
        else return WITHDRAWAL[key];
    },
    ENTER_STATUS : function(key) {
        if(key === undefined || key === null || key === '') return codeToList(ENTER_STATUS);
        else return ENTER_STATUS[key];
    },
    ARTWORK_TYPE : function(key) {
        if(key === undefined || key === null || key === '') return codeToList(ARTWORK_TYPE);
        else return ARTWORK_TYPE[key];
    },
    SIZE : function(key) {
        if(key === undefined || key === null || key === '') return codeToList(SIZE);
        else return SIZE[key];
    },
    FRAME : function(key) {
        if(key === undefined || key === null || key === '') return codeToList(FRAME);
        else return FRAME[key];
    },
    THEME_TYPE : function(key) {
        if(key === undefined || key === null || key === '') return codeToList(THEME_TYPE);
        else return THEME_TYPE[key];
    },
    SELL_TYPE : function(key) {
        if(key === undefined || key === null || key === '') return codeToList(SELL_TYPE);
        else return SELL_TYPE[key];
    },
    ARTWORK_REGIST : function(key) {
        if(key === undefined || key === null || key === '') return codeToList(ARTWORK_REGIST);
        else return ARTWORK_REGIST[key];
    },
    EVENT_TYPE : function(code) {
        if(code === undefined || code === null || code === '') return codeToList(EVENT_TYPE);
        else {
            var res = {};
            Object.keys(EVENT_TYPE).find(name => {
                if(EVENT_TYPE[name].code === code) res = EVENT_TYPE[name];
            });
            return res;
        }
    },
    PAY_TYPE : function(key) {
        if(key === undefined || key === null || key === '') return codeToList(PAY_TYPE);
        else return PAY_TYPE[key];
    },
    CMMNC_TYPE : function(key) {
        if(key === undefined || key === null || key === '') return codeToList(CMMNC_TYPE);
        else return CMMNC_TYPE[key];
    },
    CMMNC_STATUS : function(key) {
        if(key === undefined || key === null || key === '') return codeToList(CMMNC_STATUS);
        else return CMMNC_STATUS[key];
    },
    ORDER_STATUS : function(key) {
        if(key === undefined || key === null || key === '') return codeToList(ORDER_STATUS);
        else return ORDER_STATUS[key];
    },
    WARRANTY_TYPE : function(key) {
        if(key === undefined || key === null || key === '') return codeToList(WARRANTY_TYPE);
        else return WARRANTY_TYPE[key];
    },
    DELIV_REQUEST : function(key) {
        if(key === undefined || key === null || key === '') return codeToList(DELIV_REQUEST);
        else return DELIV_REQUEST[key];
    },
    ARTWORK_PRICE_OGPRT : function() {
        return ARTWORK_PRICE_OGPRT;
    },
    ARTWORK_PRICE_DTPRT : function() {
        return ARTWORK_PRICE_DTPRT;
    },
    MK_YEAR : function() {
        return MK_YEAR;
    },
    BY_REGION : function(code) {
        if(code === undefined || code === null || code === '') return codeToList(BY_REGION);
        else {
            var res = {};
            Object.keys(BY_REGION).find(name => {
                if(BY_REGION[name].code === code) res = BY_REGION[name];
            });
            return res;
        }
    },
    ALLCODE : function() {
        var res = {
            MEDIUM : MEDIUM,
            STYLE_1 : STYLE_1,
            STYLE_2 : STYLE_2,
            MATERIAL : MATERIAL,
            BASE : BASE,
            BUSINESS : BUSINESS,
            SNS_TYPE : SNS_TYPE,
            WITHDRAWAL : WITHDRAWAL,
            ENTER_STATUS : ENTER_STATUS,
            ARTWORK_TYPE : ARTWORK_TYPE,
            SIZE : SIZE,
            FRAME : FRAME,
            THEME_TYPE : THEME_TYPE,
            SELL_TYPE : SELL_TYPE,
            ARTWORK_REGIST : ARTWORK_REGIST,
            EVENT_TYPE : EVENT_TYPE,
            PAY_TYPE : PAY_TYPE,
            CMMNC_TYPE : CMMNC_TYPE,
            CMMNC_STATUS : CMMNC_STATUS,
            ORDER_STATUS : ORDER_STATUS,
            WARRANTY_TYPE : WARRANTY_TYPE,
            DELIV_REQUEST : DELIV_REQUEST,
            ARTWORK_PRICE_OGPRT : ARTWORK_PRICE_OGPRT,
            ARTWORK_PRICE_DTPRT : ARTWORK_PRICE_DTPRT,
            MK_YEAR : MK_YEAR,
            BY_REGION : BY_REGION
        };

        return res;
    }

}

function codeToList(data) {
    var res = [];
    for(var key in data) {
        res.push({
            code   : data[key].code,
            name    : data[key].name
        });
    }

    return res;
}

// 미디엄
const MEDIUM = {
    PICTURES    : {
        code   : '001',
        name    : '회화'
    },
    PRINT       : {
        code   : '002',
        name    : '판화'
    },
    CARTOON     : {
        code   : '003',
        name    : '카툰 / 일러스트'
    },
    DIGITAL_ART : {
        code   : '004',
        name    : '디지털 아트'
    },
    PHOTO       : {
        code   : '005',
        name    : '사진'
    }
};

// 스타일 1
const STYLE_1 = {
    CONTEMPORARY_ART    : {
        code   : '001',
        name    : '컨템포러리 (현대미술)'
    },
    DANSAEKHWA    : {
        code   : '002',
        name    : '단색화'
    },
    ABSTRACT_EXPRESSIONISM    : {
        code   : '003',
        name    : '추상표현'
    },
    POP_ART    : {
        code   : '004',
        name    : '팝아트'
    },
    MINIMALISM    : {
        code   : '005',
        name    : '미니멀리즘'
    },
    REALISM    : {
        code   : '006',
        name    : '사실주의/극사실주의'
    },
    IMPRESSIONISM    : {
        code   : '007',
        name    : '인상주의'
    },
    ETC    : {
        code   : '008',
        name    : '기타'
    }
};

// 스타일 2
const STYLE_2 = {
    FIGURE_PAINTINGETC    : {
        code   : '001',
        name    : '인물화'
    },
    STILL_LIFE  : {
        code   : '002',
        name    : '정물화'
    },
    LANDSCAPE   : {
        code   : '003',
        name    : '풍경화'
    },
    SELF_PORTRAIT    : {
        code   : '004',
        name    : '자화상'
    },
    ILLUSTRATION    : {
        code   : '005',
        name    : '일러스트레이션'
    },
    CHARACTER   : {
        code   : '006',
        name    : '캐릭터'
    },
    ENATURAL_OBJECTTC    : {
        code   : '007',
        name    : '자연물'
    },
    ARTIFACT    : {
        code   : '008',
        name    : '인공물'
    },
    SCIENCE_FICTION    : {
        code   : '009',
        name    : 'S.F'
    }
};

// 재료
const MATERIAL = {
    OIL_PAINTING    : {
        code       : '001',
        name        : '유화'
    },
    ACRYLIC         : {
        code       : '002',
        name        : '아크릴릭 (Acrylic)'
    },
    WATERCOLOR      : {
        code       : '003',
        name        : '수채화 (Watercolor)'
    },
    ADMIXTURE       : {
        code       : '004',
        name        : '혼합재료 (Mixed)'
    },
    PASTEL          : {
        code       : '005',
        name        : '파스텔/색연필'
    },
    ETC             : {
        code       : '006',
        name        : '기타'
    }
};

// 베이스
const BASE = {
    ORIGINAL    : {
        code    : '001',
        name    : '원화'
    },
    DIGITAL_ART : {
        code    : '002',
        name    : '디지털 아트'
    },
    CARTOON     : {
        code    : '003',
        name    : '카툰/일러스트'
    },
    PHOTO       : {
        code    : '004',
        name    : '사진'
    },
    ARTIFICIAL_INTELLIGENCE : {
        code    : '005',
        name    : '파스텔/색연필'
    }
};

// 사업자구분
const BUSINESS = {
    ORIGINAL    : {
        code   : '001',
        name    : '갤러리'
    },
    DIGITAL_ART : {
        code   : '002',
        name    : '출력소'
    }
};

// SNS 유형
const SNS_TYPE = {
    ORIGINAL    : {
        code   : '001',
        name    : '갤러리'
    },
    DIGITAL_ART : {
        code   : '002',
        name    : '출력소'
    }
};

// 탈퇴유형
const WITHDRAWAL = {
    FREQUENCY   : {
        code   : '001',
        name    : '이용빈도낮음'
    },
    REJOIN      : {
        code   : '002',
        name    : '재가입'
    },
    CONTENTS    : {
        code   : '003',
        name    : '컨텐츠/제품정보/상품부족'
    },
    PERSONAL_INFORMATION    : {
        code               : '004',
        name                : '개인정보보호'
    },
    BENEFIT     : {
        code   : '005',
        name    : '회원특혜/쇼핑혜택부족'
    },
    ETC         : {
        code   : '006',
        name    : '기타'
    }
};

// 입점진행상태
const ENTER_STATUS = {
    REQUEST     : {
        code   : '001',
        name    : '입점신청'
    },
    RECONSIDER  : {
        code   : '002',
        name    : '재검토'
    },
    REJECT      : {
        code   : '003',
        name    : '거절'
    },
    PROGRESS    : {
        code   : '004',
        name    : '계약진행'
    },
    SIGN        : {
        code   : '005',
        name    : '계약서사인(업체)'
    },
    COMPLETE    : {
        code   : '006',
        name    : '계약완료'
    }
};

// 작품구분
const ARTWORK_TYPE = {
    ORIGINAL     : {
        code   : '001',
        name    : '원화'
    },
    DIGITAL_PRINT  : {
        code   : '002',
        name    : '디지털 판화'
    },
    CALC_SIZE      : {
        code   : '003',
        name    : '사이즈 비교'
    }
};

// 사이즈
const SIZE = {
    SMALL     : {
        code   : '001',
        name    : 'S'
    },
    MEDIUM  : {
        code   : '002',
        name    : 'M'
    },
    LARGE      : {
        code   : '003',
        name    : 'L'
    }
};

// 액자
const FRAME = {
    ALUMINIUM     : {
        code   : '001',
        name    : '알루미늄'
    },
    WOOD  : {
        code   : '002',
        name    : '나무'
    }
};

// 테마유형
const THEME_TYPE = {
    ORIGINAL     : {
        code   : '001',
        name    : 'S'
    },
    DIGITAL_PRINT  : {
        code   : '002',
        name    : 'M'
    },
    CALC_SIZE      : {
        code   : '003',
        name    : 'L'
    }
};

// 판매유형
const SELL_TYPE = {
    FIXED_PRICE     : {
        code   : '001',
        name    : '정찰가'
    },
    BEADING  : {
        code   : '002',
        name    : '비딩'
    },
    BARGAIN      : {
        code   : '003',
        name    : '흥정'
    },
    INQUIRY      : {
        code   : '004',
        name    : '가격문의'
    }
};

// 판매등록상태
const ARTWORK_REGIST = {
    ORIGINAL     : {
        code   : '001',
        name    : '원화'
    },
    DIGITAL_PRINT  : {
        code   : '002',
        name    : '디지털 판화'
    },
    BOTH      : {
        code   : '003',
        name    : '둘다'
    }
};

// 행사 구분
const EVENT_TYPE = {
    INVITATION    : {
        code   : '001',
        name    : '초대전'
    },
    PERSONAL  : {
        code   : '002',
        name    : '개인전'
    },
    GROUP   : {
        code   : '003',
        name    : '그룹전'
    },
    PLAN    : {
        code   : '004',
        name    : '기획전'
    },
    ETC    : {
        code   : '005',
        name    : '그 외 전시 및 이벤트'
    },
    SPECIAL   : {
        code   : '006',
        name    : '특별전'
    },
    THEME    : {
        code   : '007',
        name    : '테마전'
    }
};

// 결제 구분
const PAY_TYPE = {
    CARD    : {
        code   : '001',
        name    : '카드'
    },
    DEPOSIT_BANK  : {
        code   : '002',
        name    : '무통장입금'
    },
    KAKAO_PAY   : {
        code   : '003',
        name    : '카카오페이'
    }
};

// 흥정 / 가격문의
const CMMNC_TYPE = {
    BARGAIN    : {
        code   : '001',
        name    : '흥정'
    },
    INQUIRY  : {
        code   : '002',
        name    : '가격문의'
    }
};

// 커뮤니케이션 진행 상태
const CMMNC_STATUS = {
    REGIST      : {
        code   : '001',
        name    : '등록'
    },
    REGIST      : {
        code   : '002',
        name    : '확인'
    }
};

// 주문배송 진행 상태
const ORDER_STATUS = {
    ORDER_CONFIRM    : {
        code   : '001',
        name    : '주문확인'
    },
    DELIVERY_READY  : {
        code   : '002',
        name    : '배송준비'
    },
    DELIVERY_PROGRESS   : {
        code   : '003',
        name    : '작품배송'
    },
    PURCHASE_CONFIRM    : {
        code   : '004',
        name    : '구매확정'
    }
};

// 주문배송 진행 상태
const WARRANTY_TYPE = {
    EXITS    : {
        code   : '001',
        name    : '보증서 있음'
    },
    ISSUE_POSSIBLE  : {
        code   : '002',
        name    : '보증서 발급 가능'
    },
    ISSUE_IMPOSSIBLE   : {
        code   : '003',
        name    : '보증서 발급 불가'
    }
};

// 주문배송 요청 사항
const DELIV_REQUEST = {
    FIGURE_PAINTINGETC    : {
        code   : '001',
        name    : '부재 시 경비실에 맡겨주세요'
    },
    STILL_LIFE  : {
        code   : '002',
        name    : '부재 시 택배함에 넣어주세요'
    },
    LANDSCAPE   : {
        code   : '003',
        name    : '부재 시 집 앞에 놔주세요'
    },
    SELF_PORTRAIT    : {
        code   : '004',
        name    : '배송 전 연락 바랍니다'
    },
    ILLUSTRATION    : {
        code   : '005',
        name    : '일파손의 위험이 있는 상품입니다 배송 시 주의해 주세요러스트레이션'
    },
    CHARACTER   : {
        code   : '006',
        name    : '직접입력'
    }
}

// 가격(단위 만원 ogPrt)
const ARTWORK_PRICE_OGPRT = [
    {   
        code    : '001',
        min     : 50000000,
        max     : 99999999999999999999,
        name    : '5,000 만원 이상'
    },
    {   
        code    : '002',
        min     : 25000000,
        max     : 50000000,
        name    : '2,500~5,000 만원'
    },
    {   
        code    : '003',
        min     : 10000000,
        max     : 25000000,
        name    : '1,000~2,500 만원'
    },
    {   
        code    : '004',
        min     : 5000000,
        max     : 10000000,
        name    : '500~1,000 만원'
    },
    {   
        code    : '005',
        min     : 2500000,
        max     : 5000000,
        name    : '250~500 만원'
    },
    {   
        code    : '006',
        min     : 1000000,
        max     : 2500000,
        name    : '100~250 만원'
    },
    {   
        code    : '007',
        min     : 0,
        max     : 999999,
        name    : '100 만원 미만'
    }
];

// 가격(단위 만원 ogDtp)
const ARTWORK_PRICE_DTPRT = [
    {   
        code    : '001',
        min     : 1000000,
        max     : 999999999999,
        name    : '100 만원 이상'
    },
    {   
        code    : '002',
        min     : 500000,
        max     : 1000000,
        name    : '50~100 만원'
    },
    {   
        code    : '003',
        min     : 300000,
        max     : 500000,
        name    : '30~50 만원'
    },
    {   
        code    : '004',
        min     : 100000,
        max     : 300000,
        name    : '10~30 만원'
    },
    {   
        code    : '005',
        min     : 0,
        max     : 100000,
        name    : '10 만원 미만'
    }
];

// 제작연도
const MK_YEAR = [
    {   
        code    : '001',
        min     : '2000',
        max     : '99999',
        name    : '2000년 대  이후'
    },
    {   
        code    : '002',
        min     : '1980',
        max     : '1990',
        name    : '1980 - 1990년 대'
    },
    {   
        code    : '003',
        min     : '1960',
        max     : '1970',
        name    : '1960 - 1970년 대'
    },
    {   
        code    : '004',
        min     : '1950',
        max     : '1960',
        name    : '1950 - 1960년 대'
    },
    {   
        code    : '005',
        min     : '1930',
        max     : '1940',
        name    : '1930 - 1940년 대'
    },
    {   
        code    : '006',
        min     : '1910',
        max     : '1920',
        name    : '1910 - 1920년 대'
    },
    {   
        code    : '007',
        min     : '0000',
        max     : '1909',
        name    : '1910년 대 이전'
    }
];

// 지역별
const BY_REGION = [
    {   
        code    : '001',
        name    : '서울'
    },
    {   
        code    : '002',
        name    : '광주'
    },
    {   
        code    : '003',
        name    : '인천'
    },
    {   
        code    : '004',
        name    : '부산'
    },
    {   
        code    : '005',
        name    : '대전.세종'
    },
    {   
        code    : '006',
        name    : '제주'
    },
    {   
        code    : '007',
        name    : '대구'
    }
];