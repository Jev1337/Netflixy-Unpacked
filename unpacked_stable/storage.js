/**
 * STORAGE | Handles storing and retrieving data from chrome's storage
 */
const ACCESS_TOKEN_KEY = 'access_token'

function storeAccessToken(value) {
    chrome.storage.local.set({
        access_token: value
    }, function () {
        console.log('StorageJS | Wrote key access_token with value ')
        console.log(value)
    })
}

function readAccessToken() {
    return new Promise(resolve => {
        chrome.storage.local.get([ACCESS_TOKEN_KEY], function (result) {
            console.log('StorageJS | Read key access_token with value ')
            console.log(result.access_token)
            resolve(result.access_token)
        })
    })
}

function clearAccessToken() {
    chrome.storage.local.clear(function() {
        var error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
        }
    });
}

/**
 * Listens for changes on local storage
 */
chrome.storage.onChanged.addListener(function (changes, areaName) {
    if (areaName == 'local') {
        console.log('StorageJS | Listener got changes ')
        console.log(changes)
        window.location.href = "/landing.html";
    }
})