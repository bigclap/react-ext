let items = {
  YOUTUBE_API3_KEY: 'AIzaSyDHI7F6S96XljbMs7N7IsN96f686CvD3CE',
  BACKEND_HOST: 'http://208.69.117.88:3000/v1',
};
chrome.storage.sync.get(items, (i) => {
  items = i;
});
const BACKEND_HOST = items.BACKEND_HOST;
const YOUTUBE_API3_KEY = items.YOUTUBE_API3_KEY;
export {
  BACKEND_HOST,
  YOUTUBE_API3_KEY,
}

