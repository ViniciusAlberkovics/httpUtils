const http = require('http');
const https = require('https');
const queryString = require('querystring');

/**
 * @param url Is string url. Example: http://google.com or https://google.com
 * @param method Is string method http. Example: GET or POST or PUT or DELETE ...
 * @param query Is the object to be sent by url. Example: {nameParameter: "valueParameter"}
 * @param body Is the object to be sent as json by the request body. Example: {a: "value1", b: "value2"}
 * @param headers Are the values to be sent in the header. Example: {'authorization': 'Bearer ...'}
 */
exports.requestWithQuery = (url, method, query, body, headers) => {
    try {
        url += '?' + queryString.stringify(query);
        return this.request(url, method, body, headers);
    } catch (error) {
        throw error;
    }
}

/**
 * @param url Is string url. Example: http://google.com or https://google.com
 * @param method Is string method http. Example: GET or POST or PUT or DELETE ...
 * @param body Is the object to be sent as json by the request body. Example: {a: "value1", b: "value2"}
 * @param headers Are the values to be sent in the header. Example: {'authorization': 'Bearer ...'}
 */
exports.request = (url, method, body, headers) => {
    try {
        let postOptions = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        }
    
        if (body) {
            body = JSON.stringify(body);
            
            postOptions.headers = {
                ...postOptions.headers,
                ...headers,
                'Content-Length': Buffer.byteLength(body)
            }
        }
    
        let response = {
            statusCode: undefined,
            returnObject: undefined
        }
        return new Promise((resolve, reject) => {
            let req = url.includes("https") ? https.request(url, postOptions) : http.request(url, postOptions);
    
            if (body)
                req.write(body);
    
            req.on('response', res => {
                let chunks = [];
                res.on('data', (chunk) => {
                    chunks.push(chunk);
                });
    
                res.on('end', () => {
                    let body = Buffer.concat(chunks);
                    let json = body.toString();
                    response.returnObject = JSON.parse(json);
                    response.statusCode = res.statusCode;
    
                    if (res.statusCode !== 200)
                        reject(response);
    
                    resolve(response);
                });

                res.on('error', error => reject(error));
            });
    
            req.end();
        });
    } catch (error) {
        throw error;
    }
}

