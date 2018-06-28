chrome.storage.sync.get({
  YOUTUBE_API3_KEY: 'AIzaSyDHI7F6S96XljbMs7N7IsN96f686CvD3CE',
  BACKEND_HOST: 'http://208.69.117.88:3000/v1',
}, (items) => {
  module.exports = items;
});

