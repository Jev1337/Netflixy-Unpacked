function isFBConnected() {
    return new Promise(resolve => {
        readAccessToken().then(access_token => {
            fetch('https://graph.facebook.com/v12.0/me?access_token=' + access_token + '&fields=%5B%22id%2Cname%2Cemail%22%5D&method=get&pretty=0&sdk=joey&suppress_http_code=1', {
                method: 'GET'
            })
                .then(response => response.json())
                .then(data => {
                    if (data.id != undefined) {
                        resolve(access_token)
                    } else {
                        resolve(false)
                    }
                })
        })
    })
}

function loginFB() {
    chrome.tabs.create({
        active: true,
        url: "https://www.facebook.com/v12.0/dialog/oauth?client_id=357140426152444&response_type=token&scope=public_profile,email&redirect_uri=https://netflixyapp.github.io/fblogin.html"
    });
}

/** **************** Utilities used in this file ************************ **/
function getCurrentWindow() {
    return new Promise(resolve => {
        chrome.windows.getCurrent(function (window) {
            resolve(window.id)
        })
    })
}
function extractAccessToken(callback_url) {
    callback_url = new URL(callback_url)
    return callback_url.hash.split('&').filter(function (el) { if (el.match('access_token') !== null) return true; }
    )[0].split('=')[1]
}