let BACKEND_URL_BASE = ""
let BACKEND_URL_BASE_S = ""

function updateHost() {
    return fetch('https://raw.githubusercontent.com/Netflixyapp/netflixy-extension/main/config.json', {
        method: 'GET',
        cache: 'no-cache'
    })
}

function validateUser(access_token, profile_id) {
    return fetch(BACKEND_URL_BASE + '/login/validate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: new URLSearchParams({
            'access_token': access_token,
            'profile_id': profile_id
        })
    })
}

function fetchAnnouncement() {
    return fetch(BACKEND_URL_BASE + '/login/announcement', {
        method: 'GET',
        cache: 'no-cache'
    })
}

function fetchUrls() {
    return fetch(BACKEND_URL_BASE + '/login/engagement', {
        method: 'GET',
        cache: 'no-cache'
    })
}

function accessNetflix(access_token) {
    return fetch(BACKEND_URL_BASE + '/access', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: new URLSearchParams({
            'access_token': access_token
        })
    })
}

function pairAndroid(access_token) {
    return fetch(BACKEND_URL_BASE + '/mobile/code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: new URLSearchParams({
            'access_token': access_token
        })
    })
}