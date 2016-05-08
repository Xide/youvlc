function getParameterByName(name, url) {
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function extractUrl(url) {
  var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  var match = url.match(urlRegex);
  if (match)
    url = match[0];

  // If it's a google url, match 'url' param
  if (url.indexOf('google.') > -1)
    url = getParameterByName('url', url);

  // Matches youtube 'v' param. Found at: http://stackoverflow.com/a/27728417
  var youtubeRegex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
  match = url.match(youtubeRegex);
  return match && url || null;
}

function entrypoint(queue, e) {
  var rawUrl = e.linkUrl || e.selectedText || e.pageUrl;
  console.log('[youvlc]', 'Raw URL:', rawUrl);
  var url = extractUrl(rawUrl);
  if (url) {
    var data = { queue: queue, url: url };
    chrome.runtime.sendNativeMessage('youvlc', data);
    console.log('[youvlc]', 'Forwarding to host script');
    console.log(data);
  } else {
    console.log('[youvlc]', "Couldn't find youtube link");
  }
}

var defaultOptions = {
  'contextMenuPlayVisible': true,
  'contextMenuEnqueueVisible': false,
};

function updateMenus() {
  chrome.contextMenus.removeAll(function () {
    chrome.storage.sync.get(defaultOptions, function (values) {
      console.log(values);
      if (values['contextMenuPlayVisible'] !== false) {
        chrome.contextMenus.create({
          title: "Play in VLC",
          contexts: ["link", "page", "selection"],
          onclick: entrypoint.bind(null, false),
        });
      }

      if (values['contextMenuEnqueueVisible'] !== false) {
        chrome.contextMenus.create({
          title: "Enqueue to VLC",
          contexts: ["link", "page", "selection"],
          onclick: entrypoint.bind(null, true),
        });
      }
    });
  });
}

// Installation Helper
// Echoing allowed_origin to add into app_manifest on first run to make it work
chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason == "install") {
    prompt('YouVLC extension ID (copy/paste in install script/app_manifest.json)', chrome.runtime.id);
  }
});


chrome.storage.onChanged.addListener(function (changes) {
  updateMenus();
});

updateMenus();
