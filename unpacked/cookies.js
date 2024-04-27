let NETFLIX_DOMAIN = "https://www.netflix.com/";
let FACEBOOK_DOMAIN = "https://www.facebook.com/";

function clearAllCookies() {
  chrome.cookies.getAll({}, function (cookies) {
    for (var i in cookies) {
      removeCookie(cookies[i]);
    }
  });
}

function removeCookie(cookie) {
  chrome.cookies.remove({ url: NETFLIX_DOMAIN, name: cookie.name })
}

function getProfileId(callback) {
  chrome.cookies.get({ url: FACEBOOK_DOMAIN, name: 'c_user' }, function (cookie) {
    if (cookie != undefined)
      callback(cookie.value)
    else (callback(''))
  });
}
