import './deliveryReg.html';

import '../popup/utilsPopUp.js';

Template.deliveryReg.onCreated(function() {
    // 배송 요청사항 내용
    selectDeliv = new ReactiveVar('');

    selectDelivEtc = new ReactiveVar('');

    // 기본배송지 설정 
    defDelivYn = new ReactiveVar(false);

    // 전화번호 없음 유/무
    homePhChk = new ReactiveVar(false);
});

Template.deliveryReg.onRendered(function() {
});

function maxLengthCheck(object){
    if (object.value.length > object.maxLength){
        object.value = object.value.slice(0, object.maxLength);
        var name = $(object).attr('name');
        var chName = name.replace(/[0-9]/g, "");
        switch(name){
            case `${chName}1`:
                $(`input[name=${chName}2]`).focus();
                break;
            case `${chName}2`:
                $(`input[name=${chName}3]`).focus();
                break;
            default:
                break;
        }
            
    }
}

Template.deliveryReg.events({
    'change #check-addrWrite--no'(evt, tmpl) {
        if($('#check-addrWrite--no').is(':checked')) {
            $('.homephones').attr('disabled', true);
            $('input[name=homePhone1]').val('');
            $('input[name=homePhone2]').val('');
            $('input[name=homePhone3]').val('');
            homePhChk.set(true);
        } else {
            $('.homephones').attr('disabled', false);
            homePhChk.set(false);
        }
    },
    'click button[name=selectDeliv]'(evt, tmpl) {
        var selection = $(evt.currentTarget).first().text();
        if(selection === '직접입력') $('input[name=delivReqEtc]').show();
        else $('input[name=delivReqEtc]').hide();
        selectDeliv.set(selection);
    },
    'change #check-addrWrite--default'(evt, tmpl) {
        if($('#check-addrWrite--default').is(':checked')) {
            defDelivYn.set(true);
        } else {
            defDelivYn.set(false);
        }
    },
    'input input[name=mob1]'(evt, tmpl)  {
        maxLengthCheck(evt.currentTarget);
    },
    'input input[name=mob2]'(evt, tmpl)  {
        maxLengthCheck(evt.currentTarget);
    },
    'input input[name=mob3]'(evt, tmpl)  {
        maxLengthCheck(evt.currentTarget);
    },
    'input input[name=homePhone1]'(evt, tmpl)  {
        maxLengthCheck(evt.currentTarget);
    },
    'input input[name=homePhone2]'(evt, tmpl)  {
        maxLengthCheck(evt.currentTarget);
    },
    'input input[name=homePhone3]'(evt, tmpl)  {
        maxLengthCheck(evt.currentTarget);
    },
    'click button[name=addrsBtn]'(evt, tmpl) {
        address(tmpl);
    },
    'click button[name=delivIns]'(evt, tmpl) {
        console.log(' ============= ');

        var recptnNm = $('input[name=recptnNm]').val().trim();

        var delivNm = $('input[name=delivNm]').val();
        
        var mob1 = $('input[name=mob1]').val();
        var mob2 = $('input[name=mob2]').val();
        var mob3 = $('input[name=mob3]').val();

        var homePhone1 = $('input[name=homePhone1]').val();
        var homePhone2 = $('input[name=homePhone2]').val();
        var homePhone3 = $('input[name=homePhone3]').val();

        var zipCode = $('input[name=zipCode]').val();
        var addr1 = $('input[name=address]').val();
        var addr2 = $('input[name=addr2]').val();

        var delivReqEtc = $('input[name=delivReqEtc]').val();

        if(recptnNm == '')                              messagePopup({message : '수령인을 입력해주세요'});
        else if(mob1 == '' || mob2 == '' || mob3 == '') messagePopup({message : '휴대전화를 정확하게 입력해주세요'});
        else if(!homePhChk.get()) {
            if(homePhone1 == '' || homePhone2 == '' || homePhone3 == '') messagePopup({message : '전화번호를 입력해주세요'});
        } else if(addr2 == '') {
            messagePopup({message : '주소를 입력해주세요'});
        } else { 
            var mobSet = mob1 + ' ' + mob2 + ' ' + mob3;
            var homePhSet = homePhone1 + ' ' + homePhone2 + ' ' + homePhone3;

            var dataSet = {
                "recptnNm" : recptnNm,
                "delivNm" : delivNm,
                "mob" : mobSet,
                "phone" : homePhSet,
                "zipCd" : zipCode,
                "addr1" : addr1,
                "addr2" : addr2,
                "defDelivYn" : defDelivYn.get() ? 'Y' : 'N',
                "delivReq" : selectDeliv.get(),
                "delivReqEtc" : delivReqEtc
            };

            Meteor.call('deliveryIns', dataSet, function(err, res) {
                $('input[name=recptnNm]').val('');
                $('input[name=delivNm]').val('');
                $('input[name=mob1]').val('');
                $('input[name=mob2]').val('');
                $('input[name=mob3]').val('');
                $('input[name=homePhone1]').val('');
                $('input[name=homePhone2]').val('');
                $('input[name=homePhone3]').val('');
                $('input[name=zipCode]').val('');
                $('input[name=address]').val('');
                $('input[name=addr2]').val('');
                $('input[name=delivReqEtc]').val('');
                
                $('#check-addrWrite--default').prop('checked', false);
                $('#check-addrWrite--no').prop('checked', false);

                defDelivYn.set(false);

                homePhChk.set(false);

                uInfo.set(Meteor.user().profile.uInfos);

                messagePopup({message : '배송지 등록이 완료되었습니다.'});

                $('#deliveryReg_popup').removeClass('is-open');
            });
        }
    }
});

Template.deliveryReg.helpers({
    addr: function() {
        return Template.instance().data;
    },
});

// 팝업 메시지 띄우기
function messagePopup(message) {
    popUpMessage.set(message);
    $('#utilsPopUp').addClass('is-open');
}

function address(instance) {
    var searchAddr = document.getElementById('searchAddr');

    // 현재 scroll 위치를 저장해놓는다.
    var currentScroll = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
    new daum.Postcode({
        oncomplete: function(data) {
            // 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

            // 각 주소의 노출 규칙에 따라 주소를 조합한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            var addr = ''; // 주소 변수
            var extraAddr = ''; // 참고항목 변수

            //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
            if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                addr = data.roadAddress;
            } else { // 사용자가 지번 주소를 선택했을 경우(J)
                addr = data.jibunAddress;
            }

            // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
            if(data.userSelectedType === 'R'){
                // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                    extraAddr += data.bname;
                }
                // 건물명이 있고, 공동주택일 경우 추가한다.
                if(data.buildingName !== '' && data.apartment === 'Y'){
                    extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                if(extraAddr !== ''){
                    extraAddr = ' (' + extraAddr + ')';
                }
                // 조합된 참고항목을 해당 필드에 넣는다.
                // document.getElementById("sample3_extraAddress").value = extraAddr;

            } else {
                // document.getElementById("sample3_extraAddress").value = '';
            }

            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            // document.getElementById('sample3_postcode').value = data.zonecode;
            // document.getElementById("sample3_address").value = addr;
            // this.data.addrs.curValue.zonecode = data.zonecode;
            // this.data.addrs.curValue.addr = addr;
            $('input[name=zipCode]').val(data.zonecode);
            $('input[name=address]').val(addr + ' ' + extraAddr);

            instance.data.addrs = data;

            // 커서를 상세주소 필드로 이동한다.
            // document.getElementById("sample3_detailAddress").focus();

            // iframe을 넣은 element를 안보이게 한다.
            // (autoClose:false 기능을 이용한다면, 아래 코드를 제거해야 화면에서 사라지지 않는다.)
            // searchAddr.style.display = 'none';

            $('#addrs-Popup').removeClass('is-open');

            // 우편번호 찾기 화면이 보이기 이전으로 scroll 위치를 되돌린다.
            document.body.scrollTop = currentScroll;
        },
        // 우편번호 찾기 화면 크기가 조정되었을때 실행할 코드를 작성하는 부분. iframe을 넣은 element의 높이값을 조정한다.
        onresize : function(size) {
            searchAddr.style.height = size.height+'px';
        },
        width : '100%',
        height : '100%'
    }).embed(searchAddr);
    

    // iframe을 넣은 element를 보이게 한다.
    // searchAddr.style.display = 'block';
    initLayerPosition();
}

function initLayerPosition(){
    var width = 415; //우편번호서비스가 들어갈 element의 width
    var height = 400; //우편번호서비스가 들어갈 element의 height
    var borderWidth = 5; //샘플에서 사용하는 border의 두께

    // 위에서 선언한 값들을 실제 element에 넣는다.
    searchAddr.style.width = width + 'px';
    searchAddr.style.height = height + 'px';
    // 실행되는 순간의 화면 너비와 높이 값을 가져와서 중앙에 뜰 수 있도록 위치를 계산한다.
    searchAddr.style.left = (((window.innerWidth || document.documentElement.clientWidth) - width)/2 - borderWidth) + 'px';
    searchAddr.style.top = (((window.innerHeight || document.documentElement.clientHeight) - height)/2 - borderWidth) + 'px';
}
