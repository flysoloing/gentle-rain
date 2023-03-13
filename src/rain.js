/**
 * 计数JS
 */
import {counterUrl, pageLinkSelector} from './config.js';

//页面流量统计入口
async function count() {
    const pagePVElems = document.querySelectorAll('.page_pv');
    //console.log('pagePVElems', pagePVElems);
    if(!pagePVElems) {
        return;
    }

    const reqData = buildReqData(pagePVElems);
    if(!reqData) {
        return;
    }
    const reqDataStr = JSON.stringify(reqData);
    //console.log('request data', reqData);
    //console.log('request data str', reqDataStr);

    const resData = await req(reqDataStr);
    if(!resData) {
        return;
    }
    const resDataStr = JSON.stringify(resData);
    //console.log('response data', resData);
    //console.log('response data str', resDataStr);

    if(resData.data && resData.data.sitePV) {
        const sitePVEl = document.querySelector('.site_pv');
        sitePVEl.innerHTML = resData.data.sitePV;
    }
    if(resData.data && resData.data.pages) {
        for(let i = 0; i < pagePVElems.length; i++) {
            pagePVElems[i].innerHTML = resData.data.pages[i].pagePV;
        }
    }
}

function buildReqData(pagePVElems) {
    let reqData = {};
    let urls = [];
    reqData.countType = '10';
    reqData.urls = urls;

    switch(pagePVElems.length) {
        case 0:
            //console.log('len = 0');
            break;
        case 1:
            let url = window.location.href;
            let pathname = window.location.pathname;
            if(!url || url.length < 1 || !pathname || pathname.length < 1) {
                return null;
            }
            if(url.includes('/#')) {
                url = url.substring(0, url.indexOf('#'));
            }
            reqData.countType = '11';
            urls.push(url);
            //console.log('len = 1');
            break;
        default:
            const aElemList = Array.prototype.slice.call(document.querySelectorAll(pageLinkSelector), 0);
            //console.log('aElemList', aElemList);
            aElemList.forEach(elem => {
                urls.push(elem.href);
            });
            //console.log('len > 1');
    }
    return reqData;
}

//发送HTTP请求
async function req(reqDataStr) {
    //console.log('counterUrl', counterUrl);
    let reqInit = {
        method: 'PUT',
        mode: 'cors',
        cache: 'default',
        referrerPolicy: 'no-referrer-when-downgrade',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: reqDataStr
    };
    try {
        let response = await fetch(counterUrl, reqInit);
        if(response.status === 200) {
            return await response.json();
        }
        return null;
    } catch (error) {
        //console.log('request failed', error);
        return null;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', count);
} else {
    count();
}