import * as axios from 'axios';
import { BACKEND_HOST, YOUTUBE_API3_KEY } from '../config';
import { uid } from '../popup/backgroundConnection';

// TODO ADD VIDEOS EXTENDED STATISTICS likes/dislakes comments count
const youtubeV3 = 'https://www.googleapis.com/youtube/v3';

// eslint-disable-next-line no-undef
chrome.windows.onFocusChanged.addListener(e => {
  window.eventSubscriber = null;
});

const getLastVideoDate = async (playlistId) => {
  const response = await axios.get(`${youtubeV3}/playlistItems`,
    {
      params: {
        key: YOUTUBE_API3_KEY,
        playlistId,
        maxResults: 1,
        part: 'contentDetails',
      },
    });
  return response.data.items[0].contentDetails.videoPublishedAt;
};

const getKeywordVideoCount = async (channelId, keyword) => {
  let keyWordVideos = [];
  const getKeywordVideos = async (nextPageToken = '') => {
    const response = await axios.get(`${youtubeV3}/search`,
      {
        params: {
          key: YOUTUBE_API3_KEY,
          channelId,
          maxResults: 50,
          part: 'snippet',
          type: 'video',
          q: keyword,
          pageToken: nextPageToken,
        },
      });
    keyWordVideos = keyWordVideos.concat(response.data.items);
    if (response.data.nextPageToken) {
      await getKeywordVideos(response.data.nextPageToken);
    }
  };
  await getKeywordVideos();
  return keyWordVideos.length;
};


window.eventSubscriber = null;

window.eventSubscribe = (callback, keyword) => {
  window.eventSubscriber = { event: callback, keyword };
};

const progress = (state) => {
  if (window.eventSubscriber && window.eventSubscriber.event) window.eventSubscriber.event(state);
};


const sendChannelsToServer = async (result, keyword) => {
  const { data: group } = await axios.post(`${BACKEND_HOST}/groups/`, {
    data: { keyword, uid },
  });
  const { data: channels } = await axios.post(`${BACKEND_HOST}/groups/${group.id}/channels`, {
    data: result,
  });

  return { group, channels };
};

window.searchVideos = async (keyword, limit) => {
  const channelsInfo = [];
  const state = {
    progress: 0,
    limit,
  };
  progress(state);
  const findChannels = async (nextPageToken) => {
    const lowLimit = limit > 50 ? 50 : limit;
    const maxResults = limit - state.progress > 50 ? lowLimit : limit - Math.floor(state.progress);
    const response = await axios.get(`${youtubeV3}/search`,
      {
        params: {
          key: YOUTUBE_API3_KEY,
          pageToken: nextPageToken,
          maxResults,
          part: 'snippet',
          type: 'video',
          q: keyword,
        },
      });

    if (response.data && response.data.items) {
      const OldIds = channelsInfo.map(e => e.channelId);
      const channelsResp = await axios.get(`${youtubeV3}/channels`,
        {
          params: {
            key: YOUTUBE_API3_KEY,
            id: response.data.items
              .map(e => e.snippet.channelId)
              .filter((elem, pos, arr) => arr.indexOf(elem) === pos && OldIds.indexOf(elem) === -1)
              .join(','),
            part: 'statistics,snippet,contentDetails',
          },
        });
      await Promise.all(channelsResp.data.items.map(async (channel) => {
        const lastActivity = await getLastVideoDate(
          channel.contentDetails.relatedPlaylists.uploads,
        );
        if ((new Date(lastActivity)).getTime() > Date.now() - (1000 * 60 * 60 * 24 * 60)) {
          state.progress += 0.4;
          progress(state);
          const keywordVideos = await getKeywordVideoCount(channel.id, keyword);
          channelsInfo.push({
            channelId: channel.id,
            name: channel.snippet.title,
            subscriberCount: channel.statistics.subscriberCount,
            avgViews: Math.floor(channel.statistics.viewCount / channel.statistics.videoCount),
            videoCount: channel.statistics.videoCount,
            lastActivity,
            keywordVideos,
          });
          state.progress += 0.6;
          progress(state);
        }
      }));

      if (channelsInfo.length < limit) {
        await findChannels(response.data.nextPageToken);
      }
    }
  };
  try {
    await findChannels();
    state.progress = state.limit;
    progress(state);
    const out = await sendChannelsToServer(channelsInfo, keyword);
    window.eventSubscribers = null;
    return out;
  } catch (e) {
    console.error(e);
    window.eventSubscribers = null;
    return null;
  }
};
