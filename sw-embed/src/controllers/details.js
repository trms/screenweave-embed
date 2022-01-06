import videojs from "video.js";

export default class EmbedDetails {
  static async insertData(videoDetailsElement, channelData) {
    let mediaId = videoDetailsElement.getAttribute("sw-video-id");
    let literal = true;
    const queryParam = videoDetailsElement.getAttribute("sw-video-id-param");
    if(queryParam) {
      const dynamicId = new URLSearchParams(window.location.search).get(queryParam);
      if(dynamicId) {
        literal = false;
        mediaId = dynamicId;
      }
    }

    //find matching media object in the channel data
    let mediaObject = null;
    for(const collectionObj of channelData.collections) {
      for(const mediaObj of collectionObj.media) {
        if(mediaObj.showId == mediaId) {
          mediaObject = mediaObj;
          break;
        }
      }
    }

    if(!mediaObject) {
      console.log(`Standalone VideoDetails: media id ${mediaId} not found in channel!`);
      return;
    }

    //fill in video data
    for(const videoElementWrapper of videoDetailsElement.querySelectorAll("[sw-player-video-tag-wrapper]")) {
      videoElementWrapper.innerHTML = "<video class='video-js vjs-big-play-centered vjs-fluid'></video>";
      for(const videoElement of videoElementWrapper.querySelectorAll("video")) {
        videojs(videoElement, {
          controls: true,
          poster: mediaObject.thumbnailUrl,
          sources: [
            {
              src: mediaObject.url,
              type: "application/vnd.apple.mpegurl",
            },
          ],
          html5: {
            vhs: {
              useDevicePixelRatio: true,
            },
          },
        });
      }
    }
    for(const titleElement of videoDetailsElement.querySelectorAll("[sw-video-details-title]"))
      titleElement.textContent = mediaObject.title;
    for(const descriptionElement of videoDetailsElement.querySelectorAll("[sw-video-details-description]"))
      descriptionElement.textContent = mediaObject.description;

    //fill in non video data
    for(const backElement of videoDetailsElement.querySelectorAll("[sw-video-details-back]")) {
      if(literal) {
        backElement.style.display = "none";
      }else{
        backElement.onclick = () => {history.back()};
      }
    }
    
    videoDetailsElement.style.visibility = "visible";
  }
}