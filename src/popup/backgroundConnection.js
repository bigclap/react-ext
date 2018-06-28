/* eslint-disable no-undef */
const backgroundConnection = chrome.extension.getBackgroundPage();
const uid = chrome.runtime.id;
export { backgroundConnection, uid };
