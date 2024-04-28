var ERROR_MESSAGE = ''

chrome.action.onClicked.addListener(function (tab) {
  chrome.windows.create({
    url: chrome.runtime.getURL("landing.html"),
    type: "popup",
    height: 700,
    width: 700
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request)
  if (request) {
    if (request.msg == 'set') {
      ERROR_MESSAGE = request.data
      sendResponse({ sender: 'landing.js', data: true }); // This response is sent to the message's sender 
    } else if (request.msg == 'get') {
      sendResponse({ sender: 'login.js', data: ERROR_MESSAGE }); // This response is sent to the message's sender 
    } else if (request.msg =='clear') {
      ERROR_MESSAGE = ''
    }
  }
});
