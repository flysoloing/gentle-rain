/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev src/index.js` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npx wrangler publish src/index.js --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
export default {
	async fetch(request, env, ctx) {
        //处理OPTIONS请求
        async function handleOptions(request) {
            if (request.headers.get('Origin') !== null
                && request.headers.get('Access-Control-Request-Headers') !== null
                && request.headers.get('Access-Control-Request-Method') !== null) {
                //处理CORS preflight请求
                return new Response(null, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS, POST, PUT',
                        'Access-Control-Max-Age': '60',
                        'Access-Control-Allow-Headers': request.headers.get('Access-Control-Request-Headers') + ', Origin',
                    }
                });
            } else {
                //处理标准OPTIONS请求
                return new Response(null, {
                    headers: {
                        'Access-Control-Request-Method': 'GET, HEAD, OPTIONS, POST, PUT',
                    }
                });
            }
        }

        //计数
        async function count(request) {
            let code = '200';
            let message = 'OK';
            let data = {};

            const reqBody = await readReqBody(request);
            console.log('reqBody', reqBody);
            if(!reqBody) {
                return buildCountRes('400', 'request body is not exist', null);
            }
            const countType = reqBody.countType;
            const urls = reqBody.urls;
            if(!countType || !urls) {
                return buildCountRes('400', 'count type or url array is not exist', null);
            }
            if(countType === '01') {
                return buildCountRes(code, 'count type is 01, no count', null);
            }
            if(countType === '00') {
                return buildCountRes(code, 'count type is 00, no count', null);
            }

            const ua = request.headers.get('User-Agent');
            //console.log(ua);
            const ip = request.headers.get('CF-Connecting-IP');
            //console.log(ip);
            const rf = request.headers.get('Referer');
            //console.log(rf);
            const or = request.headers.get('Origin');
            //console.log(or);

            let sitePVKeyPrefix = 'sitePV:';
            let siteUVKeyPrefix = 'siteUV:';
            let pagePVKeyPrefix = 'pagePV:';
            let pageUVKeyPrefix = 'pageUV:';

            let sitePVKey = sitePVKeyPrefix + or.normalize();
            let sitePVNum = await env.VIEWS.get(sitePVKey);
            //console.log('sitePVNum', sitePVNum);
            if(sitePVNum) {
                sitePVNum = Number(sitePVNum) + 1;
            } else {
                sitePVNum = 1;
            }
            env.VIEWS.put(sitePVKey, sitePVNum.toString());
            data.sitePV = sitePVNum;

            if(countType === '10') {
                if(urls) {
                    let tmpArr = [];
                    for(const el of urls) {
                        let pagePVKey = pagePVKeyPrefix + el.normalize();
                        let pagePVNum = await env.VIEWS.get(pagePVKey);
                        if(!pagePVNum) {
                            pagePVNum = 0;
                        }
                        let tmpObj = {
                            url: el,
                            pagePV: pagePVNum
                        }
                        tmpArr.push(tmpObj);
                    };
                    data.pages = tmpArr;
                }
            }
            if(countType === '11') {
                if(urls) {
                    let tmpArr = [];
                    let pagePVKey = pagePVKeyPrefix + urls[0].normalize();
                    let pagePVNum = await env.VIEWS.get(pagePVKey);
                    if(pagePVNum) {
                        pagePVNum = Number(pagePVNum) + 1;
                    } else {
                        pagePVNum = 1;
                    }
                    env.VIEWS.put(pagePVKey, pagePVNum.toString());
                    let tmpObj = {
                        url: urls[0],
                        pagePV: pagePVNum
                    }
                    tmpArr.push(tmpObj);
                    data.pages = tmpArr;
                }
            }
            return buildCountRes(code, message, data);
        }

        //读取请求内容
        async function readReqBody(request) {
            const contentType = request.headers.get('content-type');
            if (contentType.includes('application/json')) {
                return await request.json();
            } else {
                return null;
            }
        }

        //构建应答数据
        function buildCountRes(code, message, data) {
            const resData = {
                'code': code,
                'message': message,
                'data': data
            };
            const resDataStr = JSON.stringify(resData, null, 2);
            console.log('resData', resDataStr);
            const resInit = {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS, POST, PUT',
                    'Access-Control-Max-Age': '60',
                    'Access-Control-Allow-Headers': 'Origin',
                }
            };
            return new Response(resDataStr, resInit);
        }

        //请求处理逻辑
        const method = request.method.toUpperCase();
        //预处理
        if(method === 'OPTIONS') {
            return handleOptions(request);
        }
        if(method === 'PUT') {
            return count(request);
        }
        console.log(method + 'Method Not Allowed');
        return new Response(null, {
            status: 405,
            statusText: 'Method Not Allowed',
        });
	}
};