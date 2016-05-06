

/*
 * General utility function to retreive parameter from an url
 * Found on : http://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-url-parameter
 */

function getQueryParams(qs) {
  qs = qs.split('+').join(' ');

  var params = {},
      tokens,
      re = /[?&]?([^=]+)=([^&]*)/g;

      while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
      }

  return params;
}


function extract_url(url) {
  console.log('Raw URL : ' + url)
  
  if (url.indexOf('google') > -1) {
    console.log('Extracting Youtube URL from Google')
    /*
     *  Extract URL of shape like :
     *  https://www.google.fr/url?sa=t&rct=j&q=&esrc=s&source=web&cd=6&cad=rja&uact=8&ved=0ahUKEwjY1cGwoPHLAhWBnBoKHTEbAAMQuAIITDAF&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DKRZZL5saqSE&usg=AFQjCNEt6xSnm3HzuovWZEu1Gx0a-kj_zg&sig2=LHg2wBNQLYlHy4o_RrOLwQ
     *  to extract the youtube url inside
     */
    parameters = getQueryParams(url)
    url = parameters['url']
    console.log('Extracted URL : ' + url)
  }

  return url
}

function open_vlc(info, tab) {  
  url = extract_url(info.linkUrl)
  chrome.runtime.sendNativeMessage('youvlc', {text: url}); 
}


function queue_vlc(info, tab) {

}


chrome.contextMenus.create({
      title: "Open in VLC", 
      contexts:["link"], 
      onclick: open_vlc,
});
