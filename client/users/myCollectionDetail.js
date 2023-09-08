import './myCollectionDetail.html';

import { jsPDF } from "jspdf";

import html2canvas from 'html2canvas';

import { Atwrk } from '../../lib/collections.js';

Template.myCollectionDetail.onCreated(function() {
    Meteor.subscribe('Atwrk');

    pric = new ReactiveVar();
});

Template.myCollectionDetail.onRendered(function() {
});

Template.myCollectionDetail.events({
    'click button[name=editPric]' (evt, tmpl) {
        $(evt.currentTarget).attr('data-id');

        const $this = $(evt.currentTarget);
        dataId = $this.attr('data-id');
        contId = $('#' + dataId);
        contId.addClass('is-open');
    },
    'click button[name=allSelt]' (evt, tmpl) {
        $('input[name=chkMyCollect]').prop('checked', true);
    },
    'click button[name=linkBtn]' (evt, tmpl) {
        var url = window.location.href;
        navigator.clipboard.writeText(url);
    },
    'click button[name=imgList]'(evt, tmpl) {
        var imgSrc = evt.target.src;
        $('img[name=mainImg]').attr('src', imgSrc);
    },
    'click button[name=pdfBtn]' (evt, tmpl) {
        html2canvas(document.getElementById('capture')).then(canvas => {
            // base64 url 로 변환
            var imgData = canvas.toDataURL('image/jpeg');
          
            var imgWidth = 210; // 이미지 가로 길이(mm) A4 기준
            var pageHeight = imgWidth * 1.414; // 출력 페이지 세로 길이 계산 A4 기준
            var imgHeight = canvas.height * imgWidth / canvas.width;
            var heightLeft = imgHeight;
            var margin = 0;
          
            var doc = new jsPDF('p', 'mm', 'a4');
            var position = 0;
          
            // 첫 페이지 출력
            doc.addImage(imgData, 'jpeg', margin, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          
            // 한 페이지 이상일 경우 루프 돌면서 출력
            while (heightLeft >= 20) {
              position = heightLeft - imgHeight;
              doc.addPage();
              doc.addImage(imgData, 'jpeg', margin, position, imgWidth, imgHeight);
              heightLeft -= pageHeight;
            }
          
            // 파일 저장
            doc.save(`${this.ogPrt.mkYY}_${this.atstInfo.atstNm}_${this.ogPrt.atwrkNm}.pdf`);
          });
    },
    'click button[name=closePopup]' (evt, tmpl) {
        $('#editPric').removeClass('is-open');
    },
    'click button[name=editPricBtn]'(evt, tmpl) {

    }
});

Template.myCollectionDetail.helpers({
    myCollect() {
        let res = Atwrk.findOne({ _id : this.detailId() });

        return res;
    }
});
