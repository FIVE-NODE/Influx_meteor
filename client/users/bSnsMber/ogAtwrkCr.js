import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './ogAtwrkCr.html';

import '../../popup/utilsPopUp.js';

const numberChk = /[^0-9.]/g; 
const comma = /\B(?=(\d{3})+(?!\d))/g;

Template.ogAtwrkCr.onCreated(function() {
    // 작품 플래그
    atwrkFlag = new ReactiveVar(this.data.flag());

    // Key 해당하는 이미지 저장
    imgUrl = new ReactiveDict();

    // 모든 img 리스트로 통합해서 저장
    imgList = new ReactiveVar();

    // 미디움 저장
    medium = new ReactiveVar();
    
    // 재료 저장
    material = new ReactiveVar();

    // 스타일1 저장
    style1 = new ReactiveVar();
    
    // 스타일2 저장
    style2 = new ReactiveVar();

    // 보증서 여/부
    guarantee = new ReactiveVar();

    // 카달로그 여/부
    catalog = new ReactiveVar();

    // 베이스
    base = new ReactiveVar();

    // 업데이트용 데이터 저장용
    atwrkInfo = new ReactiveVar();

    // 업데이트 플래그
    updateFlag = new ReactiveVar(false);

    deleteList = new ReactiveVar([]);

    if(this.data.atwrkId() != undefined) {
        Meteor.call('seltGlryAtwrkDetail', this.data.atwrkId(), 'N', function(err, res) {
            atwrkInfo.set(res);

            // 업데이트 수정 로직 (데이터 셋)
            if(atwrkInfo.get() != undefined) {
                var atInfo = atwrkInfo.get();

                // 작품 구분 셋팅
                if(atInfo.atwrkTp == '001')$('#check-writeInfo--productAdmit--01').click();
                else if(atInfo.atwrkTp == '002') $('#check-writeInfo--productAdmit--02').click();
                else $('#check-writeInfo--productAdmit--03').click();

                atwrkFlag.set(atInfo.atwrkTp);
                console.log('flag : ', atwrkFlag.get());

                var image = atInfo.image;

                // 이미지 셋팅
                for(idx in image) {
                    if(image[idx].rprsn == 'Y') {
                        $(`div[name=mainUploadImg]`).css({
                            'background-size' : 'contain',
                            'background-image' : `url(${image[idx].imgID})`,
                            'background-repeat': 'no-repeat',
                            'background-position': 'center center'
                        });
                        imgUrl.set('mainUploadImg', image[idx].imgID);
                    } else {
                        $(`div[name=uploadImg_0${image[idx].imgSortNo - 1}]`).css({
                            'background-size' : 'contain',
                            'background-image' : `url(${image[idx].imgID})`,
                            'background-repeat': 'no-repeat',
                            'background-position': 'center center'
                        });
                        imgUrl.set(`uploadImg_0${image[idx].imgSortNo}`, image[idx].imgID);
                    }
                }

                // 작가 사진 셋팅
                $('div[name=uploadAtstImg]').css({
                    'background-size' : 'contain',
                    'background-image' : `url(${atInfo.atstInfo.atstImage})`,
                    'background-repeat': 'no-repeat',
                    'background-position': 'center center'
                });
                imgUrl.set('uploadAtstImg', atInfo.atstInfo.atstImage);

                // 작가 이름, 소개, 추가 정보 셋팅
                $('input[name=atstNm]').val(atInfo.atstInfo.atstNm);
                $('textarea[name=atstDesc]').val(atInfo.atstInfo.atstDesc);
                $('textarea[name=atstAddDesc]').val(atInfo.atstInfo.atstAddDesc);
                
                pricDisalbledSet(atInfo.atwrkTp);
                
                // 작품 제목, 제작년도 크기
                if(atInfo.atwrkTp == '002') {
                    $('input[name=atwrkNm]').val(atInfo.dtPrt.atwrkNm);
                    $('input[name=mkYY]').val(atInfo.dtPrt.mkYY);
                    $('input[name=002Pric]').val(atInfo.dtPrt.sPric);

                    $(`button[name=seltBase]`).text($(`#BASE_${atInfo.dtPrt.base}`).text());
                    base.set(atInfo.dtPrt.base);
                    $(`button[name=seltStyle1]`).text($(`#STYLE1_${atInfo.dtPrt.style1}`).text());
                    style1.set(atInfo.dtPrt.style1);
                    $(`button[name=seltStyle2]`).text($(`#STYLE2_${atInfo.dtPrt.style2}`).text());
                    style2.set(atInfo.dtPrt.style2);

                    $('input[name=002Pric]').val(atInfo.dtPrt.sPric.toString().replace(comma,','));
                } else {
                    $('input[name=atwrkNm]').val(atInfo.ogPrt.atwrkNm);
                    $('input[name=mkYY]').val(atInfo.ogPrt.mkYY);
                    $('input[name=hSize]').val(atInfo.ogPrt.hSize);
                    $('input[name=wSize]').val(atInfo.ogPrt.wSize);
                    $('input[name=dSize]').val(atInfo.ogPrt.dSize);

                    $(`button[name=seltMedium]`).text($(`#MEDIUM_${atInfo.ogPrt.medium}`).text());
                    medium.set(atInfo.ogPrt.medium)
                    $(`button[name=seltMaterial]`).text($(`#MATERIAL_${atInfo.ogPrt.metRias}`).text());
                    material.set(atInfo.ogPrt.metRias)
                    $(`button[name=seltStyle1]`).text($(`#STYLE1_${atInfo.ogPrt.style1}`).text());
                    style1.set(atInfo.ogPrt.style1);
                    $(`button[name=seltStyle2]`).text($(`#STYLE2_${atInfo.ogPrt.style2}`).text());
                    style2.set(atInfo.ogPrt.style2);
                    
                    if(atInfo.atwrkTp == '003') {
                        $(`button[name=seltBase]`).text($(`#BASE_${atInfo.dtPrt.base}`).text());
                        base.set(atInfo.dtPrt.base);
                    }

                    $('input[name=001Pric]').val(atInfo.ogPrt.pric.toString().replace(comma,','));

                    if(atInfo.atwrkTp == '003') $('input[name=002Pric]').val(atInfo.dtPrt.sPric.toString().replace(comma,','));
                }

                if(Object.keys(atInfo.ogPrt) != 0) {
                    switch(atInfo.ogPrt.wartyYn) {
                        case '001':
                            $('#check-writeInfo--hasInsuranceY').prop('checked', true);
                            guarantee.set('001');
                            break;
                        case '002':
                            $('#check-writeInfo--hasInsuranceN').prop('checked', true);
                            $('#check-writeInfo--admitInsuranceY').prop('checked', true);
                            guarantee.set('002');
                            break;
                        default:
                            $('#check-writeInfo--hasInsuranceN').prop('checked', true);
                            $('#check-writeInfo--admitInsuranceN').prop('checked', true);
                            guarantee.set('003');
                            break;
                    }
    
                    if(atInfo.ogPrt.catgYn == 'Y') {
                        $('#check-writeInfo--catalogY').prop('checked', true);
                        catalog.set('Y');
                    } else {
                        $('#check-writeInfo--catalogN').prop('checked', true);
                        catalog.set('N');
                    }
                }
                

                updateFlag.set(true);
            }
        });
    }
});

Template.ogAtwrkCr.onRendered(function() {
    // if(atwrkFlag.get() == '001') {
    //     pricDisalbledSet(atwrkFlag.get());
    // } else if(atwrkFlag.get() == '002') {
    //     pricDisalbledSet(atwrkFlag.get());
    // } else {
    //     pricDisalbledSet(atwrkFlag.get());
    // }
});

// 인풋 콤마 찍기
function inputComma(pric) {
    var pricVal = pric.val().toString();
    pric.val(Meteor.clientCommonUtils.onlyNumAndComma(pricVal));
}

// 팝업 메시지 띄우기
function messagePopup(message) {
    popUpMessage.set(message);
    $('#utilsPopUp').addClass('is-open');
}

// 작품 등록시 선택한 것에 따른 display 변경
function flagSetDislay(display) {
    $('dt[name=ogSizeDt]').css('display', display);
    $('dd[name=ogSizeDd]').css('display', display);
    
    $('dt[name=ogMediDt]').css('display', display);
    $('dd[name=ogMediDd]').css('display', display);
    
    $('dt[name=ogMateDt]').css('display', display);
    $('dd[name=ogMateDd]').css('display', display);   
}


// 등록 Flag 별 CSS 셋팅
function pricDisalbledSet(flag) {
    switch(flag) {
        case '003':
            $('dt[name=001Dt]').removeClass('disable');
            $('div[name=001Div]').removeClass('disable');
            $('input[name=001Pric]').prop('disabled', false);
            
            $('dt[name=002Dt]').removeClass('disable');
            $('div[name=002Div]').removeClass('disable');
            $('input[name=002Pric]').prop('disabled', false);

            $('dt[name=baseDt]').css('display', '');
            $('dd[name=baseDd]').css('display', '');

            flagSetDislay('');
            break;
        default:
            $(`input[name=${flag}Pric]`).prop('disabled', false);
            $(`dt[name=${flag}Dt]`).removeClass('disable');
            $(`div[name=${flag}Div]`).removeClass('disable');

            if(flag == 002) {
                $('dt[name=baseDt]').css('display', '');
                $('dd[name=baseDd]').css('display', '');

                flagSetDislay('none');
            } else {
                flagSetDislay('');
            }

            flag = flag == '001' ? '002' : '001';

            $(`input[name=${flag}Pric]`).val('');
            $(`input[name=${flag}Pric]`).prop('disabled', true);
            $(`dt[name=${flag}Dt]`).addClass('disable');
            $(`div[name=${flag}Div]`).addClass('disable');
            break;
    }
}

Template.ogAtwrkCr.events({
    // 원화, 디지털 판화, 원화 + 디지털 판화 선택 radio
    'change input[name=check-writeInfo--productAdmit]' (evt, tmpl) {
        var flag = $(evt.currentTarget).val();
        atwrkFlag.set(flag);
        pricDisalbledSet(flag);
        if(flag == '002') {
            $('div[name=catelogDiv]').css({'display' : 'none'});
            $('dd[name=guarantee]').css({'display' : 'none'});
            $('dt[name=guarantee]').css({'display' : 'none'});
            $('#check-writeInfo--catalogN').prop('checked', true);
            catalog.set('N');
        } else {
            $('dd[name=guarantee]').css({'display' : ''});
            $('dt[name=guarantee]').css({'display' : ''});
            $('div[name=catelogDiv]').css({'display' : ''});
        }
    },
    // 보증서 여/부
    'change input[name=check-writeInfo--hasInsurance]'(evt, tmpl) {
        var id = $(evt.currentTarget).attr('id');
        switch(id) {
            case 'check-writeInfo--hasInsuranceY':
                guarantee.set('001');
                $('input[name=check-writeInfo--admitInsurance]').addClass('disabled');
                $('input[name=check-writeInfo--admitInsurance]').prop('disabled', true);
                $('#check-writeInfo--admitInsuranceY').prop('checked', false);
                $('#check-writeInfo--admitInsuranceN').prop('checked', false);
                break;
            default:
                $('input[name=check-writeInfo--admitInsurance]').removeClass('disabled');
                $('input[name=check-writeInfo--admitInsurance]').prop('disabled', false);
                break;
        }
    },
    // 보증서 발급 여/부 (보증서 여/부 아니오일 때)
    'change input[name=check-writeInfo--admitInsurance]'(evt, tmpl) {
        var id = $(evt.currentTarget).attr('id');
        switch(id) {
            case 'check-writeInfo--admitInsuranceY':
                guarantee.set('002');
                break;
            default:
                guarantee.set('003');
                break;
        }
    },
    // 작품 전시 카달로그 여/부
    'change input[name=check-writeInfo--catalog]' (evt, tmpl) {
        var id = $(evt.currentTarget).attr('id');
        switch(id) {
            case 'check-writeInfo--catalogY':
                catalog.set('Y');
                break;
            default:
                catalog.set('N');
                break;
        }
    },
    'click button[name=mainImgBtn]'(evt, tmpl) {
        $('#mainUploadImg').click();
    },
    'click button[name=btnUploadImg]'(evt, tmpl) {
        var btnVal = $(evt.currentTarget).val();
        $(`#${btnVal}`).click();
    },
    // 이미지 업로드 이벤트
    'change input[name=imgUploads]'(evt, tmpl) {
        var imgId = $(evt.currentTarget).attr('id');

        var fileReader = new FileReader();
        var fileName = evt.currentTarget.files[0].name;
        var type = evt.currentTarget.files[0].type;
        

        var pathPoint = evt.currentTarget.value.lastIndexOf('.');
        var pointFile = evt.currentTarget.value.substring(pathPoint + 1, evt.currentTarget.value.length);
        var fileType = pointFile.toLowerCase();

        var file = evt.currentTarget.files[0];

        if(type.indexOf('image/') > -1) {
            fileReader.onload = (file) => {
                var image = {
                    blob : file.srcElement.result,
                    name : fileName,
                    encoding : 'binary'
                };
                Meteor.call('saveFile', image, function(err, res) {
                    if(err) console.log(err);
                    else {
                        // 삭제용 리스트 
                        if(updateFlag.get() == true && imgUrl.get(imgId) != undefined) {
                            var deleteData = deleteList.get();
                            deleteData.push(imgUrl.get(imgId));
                            deleteList.set(deleteData);
                        }
                        imgUrl.set(imgId, res.fileName);
                        
                        $(`div[name=${imgId}]`).css({
                            'background-size' : 'contain',
                            'background-image' : `url(/temps/${imgUrl.get(imgId)})`,
                            'background-repeat': 'no-repeat',
                            'background-position': 'center center'
                        });
                    }
                });
            };
            fileReader.readAsBinaryString(file);
        } else {
            alert('이미지 파일만 업로드 해주세요'); 
        }
    
    },
    'keyup input[name=001Pric]'(evt, tmpl) {
        inputComma($(evt.currentTarget));
    },
    'keyup input[name=002Pric]'(evt, tmpl) {
        inputComma($(evt.currentTarget));
    },
    'click button[name=selectKind]'(evt, tmpl) {
        var kindAndCode = $(evt.currentTarget).attr('id').split('_');
        switch(kindAndCode[0]) {
            case 'MEDIUM':
                medium.set(kindAndCode[1]);
                break;
            case 'MATERIAL':
                material.set(kindAndCode[1]);
                break;
            case 'STYLE1':
                style1.set(kindAndCode[1]);
                break;
            case 'STYLE2':
                style2.set(kindAndCode[1]);
            case 'BASE':
                base.set(kindAndCode[1]);
                break;
        }

    },
    'click button[name=cancel]'(evt, tmpl) {
        history.back();
    },
    'click button[name=allDoneBtn]' (evt, tmpl) {
        var imgAll = imgUrl.all();
        delete imgAll.uploadAtstImg;

        var mainImgSize = '';
        var imgSize = new Image();
        var _height;

        imgSize.src = '/temps/' + imgAll.mainUploadImg;
        _height = imgSize.height;

        if(_height < 320) mainImgSize = 'S';
        else if(_height > 320 && _height < 480) {
            var size1 = _height - 320;
            var size2 = 480 - _height;
            mainImgSize = size1 < size2 ? 'S' : 'M';
        } else if(_height > 480 && _height < 700) {
            var size1 = _height - 480;
            var size2 = 700 - _height;
            mainImgSize = size1 < size2 ? 'M' : 'L';
        } else mainImgSize = 'L';

        var atstNm = $('input[name=atstNm]').val().trim();
        var atstDesc = $('textarea[name=atstDesc]').val().trim();
        var atstAddDesc = $('textarea[name=atstAddDesc]').val().trim();
        var sngl = $('textarea[name=sngl]').val().trim();
        var atwrkNm = $('input[name=atwrkNm]').val().trim();
        var mkYY = $('input[name=mkYY]').val().trim();
        var hSize = $('input[name=hSize]').val().trim();
        var wSize = $('input[name=wSize]').val().trim();
        var dSize = $('input[name=dSize]').val().trim();
        var baseVal = base.get();
        var mediumVal = medium.get();
        var materialVal = material.get();
        var style1Val = style1.get();
        var style2Val = style2.get();
        var guarant = guarantee.get();
        var catlog = catalog.get();
        var ogPric = $('input[name=001Pric]').val();
        var dtPric = $('input[name=002Pric]').val();

        var atFlag = atwrkFlag.get();

        var atstImage = imgUrl.get('uploadAtstImg') == undefined ? '' : imgUrl.get('uploadAtstImg');
        var mainImg = imgAll.mainUploadImg == undefined ? '' : imgAll.mainUploadImg;;

        if(atFlag == undefined)                 {   messagePopup({message : '원화 또는 디지털판화를 선택해주세요'});  }
        else if(mainImg == '')                      messagePopup({message : '작품사진 은 필수 입니다.'});
        else if(Object.keys(imgAll).length < 3)     messagePopup({message : '작품사진 포함 디테일 사진 2개 이상 올려주셔야 합니다.'});
        else if(atstNm == '')                   {   messagePopup({message : '작가이름은 필수 입니다.'});    $('input[name=atstNm]').focus();     }
        else if(atstDesc == '')                 {   messagePopup({message : '작가 소개 는 필수 입니다.'});  $('input[name=atstDesc]').focus();   }
        else if(atwrkNm == '')                  {   messagePopup({message : '작품이름은 필수 입니다.'});    $('input[name=atwrkNm]').focus();    }
        else if(mkYY == '')                     {   messagePopup({message : '제작년도은 필수 입니다.'});    $('input[name=mkYY]').focus();       }
        else if(hSize == '')                    {   messagePopup({message : '작품높이는 필수 입니다.'});    $('input[name=hSize]').focus();    }
        else if(wSize == '')                    {   messagePopup({message : '작품너비은 필수 입니다.'});    $('input[name=wSize]').focus();      }
        else if(dSize == '')                    {   messagePopup({message : '작품깊이은 필수 입니다.'});    $('input[name=dSize]').focus();      }
        else if((atFlag == '002' || atFlag == '003') && baseVal == undefined)
                                                {   messagePopup({message : '베이스를 선택해주세요'});  }
        else if((atFlag == '001' || atFlag == '003') && mediumVal == undefined)         
                                                {   messagePopup({message : '미디움 선택은 필수 입니다.'});         }
        else if((atFlag == '001' || atFlag == '003') && materialVal == undefined)
                                                {   messagePopup({message : '재료 선택은 필수 입니다.'});           }
        else if(style1Val == undefined)         {   messagePopup({message : '스타일1 선택은 필수 입니다.'});        }
        else if(style2Val == undefined)         {   messagePopup({message : '스타일2 선택은 필수 입니다.'});        }
        else if(atFlag == '001' && ogPric == ''){   messagePopup({message : '원화 금액을 입력해주세요'});           }
        else if(atFlag == '002' && dtPric == ''){   messagePopup({message : '디지털 판화 금액을 입력해주세요'});    }
        else if(atFlag == '003' && (ogPric == '' || dtPric == ''))
                                                {   messagePopup({message : '원화 또는 판화 금액을 입력해주세요'});  }
        else if(guarant == undefined)           {   messagePopup({message : '보증서 여/부는 필수 선택입니다.'});      }
        else if(catlog == undefined)            {   messagePopup({message : '카다로그 여/부는 필수 선택입니다.'});    }
        else {
            let data = {
                deleteList : deleteList.get(),
                updateFlag : updateFlag.get(),
                atwrkTp : atFlag,
                atstNm,
                atstDesc,
                atwrkNm,
                atstImage,
                mkYY,
                hSize,
                wSize,
                dSize,
                base : baseVal,
                atstAddDesc,
                medium : mediumVal,
                metRias : materialVal,
                style1 : style1Val,
                style2 : style1Val,
                ogPric,
                dtPric,
                guarant,
                mainImgSize,
                imgAll,
                sngl : sngl,
                catlog
            };
            
            if(updateFlag.get() == true) {
                data._id = atwrkInfo.get()._id;
                Meteor.call('updateAtwrk', data, function(err, res) {
                    if(err) console.log(err);
                    else {
                        messagePopup({message : '작품 수정이 완료되었습니다.'});
                        FlowRouter.go('/glryAtwrks');
                    }
                })
            } else {
                Meteor.call('insertAtwrk', data, function(err, res) {
                    if(err) console.log(err);
                    else {
                        messagePopup({message : '작품 등록이 완료되었습니다.'});
                        FlowRouter.go('/glryAtwrks');
                    }
                });
            }
        }

    },
});

Template.ogAtwrkCr.helpers({
    medium() {
        return Meteor.codes.MEDIUM();
    },
    style1() {
        return Meteor.codes.STYLE_1();
    },
    style2() {
        return Meteor.codes.STYLE_2();
    },
    materials() {
        return Meteor.codes.MATERIAL();
    },
    base() {
        return Meteor.codes.BASE();
    },
    dtpChk() {
        if(atwrkFlag.get() != undefined) {
            return (atwrkFlag.get() == '002' || atwrkFlag.get() == '003') ? 'block' : 'none';
        }        
    },
    ogDtpChk() {
        if(atwrkFlag.get() != undefined) {
            return atwrkFlag.get() != '002';
        }     
    }

});

