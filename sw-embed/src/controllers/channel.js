import videojs from "video.js";
import IncludeMedia from "./media.js";

export default class EmbedChannel {
  static async insertData(channelElement, channelData) {
    //fill in channel level data
    const bannerElements = channelElement.querySelectorAll("[sw-channel-banner]");
    for(const bannerElement of bannerElements) bannerElement.setAttribute("src", channelData.bannerUrl);

    //iterate collections
    const oldCollectionElement = channelElement.querySelector("sw-collection");
    const newCollectionsContainer = document.createElement("span");
    if(!oldCollectionElement) {
      console.log(`Channel ${channelData.id} contained no collection tag!`);
    }else{
      for(const collectionObject of channelData.collections) {
        const collectionElementClone = oldCollectionElement.cloneNode(true);
        //fill in collection level data
        for(const collectionNameElement of collectionElementClone.querySelectorAll("[sw-collection-name]"))
          collectionNameElement.textContent = collectionObject.name;

        //iterate media
        const oldMediaElement = collectionElementClone.querySelector("sw-media");
        const newMediaContainer = document.createElement("span");
        if(!oldMediaElement) {
          console.log(`Collection elements in channel ${channelData.id} contain no media tag!`);
        }else{
          for(const mediaObject of collectionObject.media) {
            const mediaElementClone = oldMediaElement.cloneNode(true);
            
            //fill in media level data
            IncludeMedia.insertData(mediaElementClone, mediaObject, () => {EmbedChannel.showVideoDetails(channelElement, mediaObject)});

            //add new media to container
            newMediaContainer.appendChild(mediaElementClone);
          }
          //replace original media tag with container of data-filled media
          oldMediaElement.parentNode.replaceChild(newMediaContainer, oldMediaElement);
        }
        
        //add new collection to container
        newCollectionsContainer.appendChild(collectionElementClone);
      }
      //replace original collection tag with container of data-filled collections
      oldCollectionElement.parentNode.replaceChild(newCollectionsContainer, oldCollectionElement);
    }

    //universal parts of Video Details
    const videoDetailsElement = channelElement.querySelector("sw-video-details");
    if(!videoDetailsElement) {
      console.log(`Channel ${channelData.id} contained no video details tag!`);
    }else{
      for(const backElement of videoDetailsElement.querySelectorAll("[sw-video-details-back]"))
        backElement.onclick = () => {EmbedChannel.showCollections(channelElement)};
    }
  }

  static hideChannelSubcomponents(channelElement) {
    for(const collection of channelElement.querySelectorAll("sw-collection"))
      collection.style.display = "none";
    for(const details of channelElement.querySelectorAll("sw-video-details")) {
      for(const videoElement of details.querySelectorAll("video")) {
        videojs(videoElement).dispose();
      }
      details.style.display = "none";
    }
  }

  static showCollections(channelElement) {
    EmbedChannel.hideChannelSubcomponents(channelElement);
    for(const collection of channelElement.querySelectorAll("sw-collection"))
      collection.style.display = null;
  }

  static showVideoDetails(channelElement, mediaObject) {
    EmbedChannel.hideChannelSubcomponents(channelElement);
    for(const details of channelElement.querySelectorAll("sw-video-details")) {
      details.style.display = null;
      for(const videoElementWrapper of details.querySelectorAll("[sw-player-video-tag-wrapper]")) {
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
      for(const titleElement of details.querySelectorAll("[sw-video-details-title]"))
        titleElement.textContent = mediaObject.title;
      for(const descriptionElement of details.querySelectorAll("[sw-video-details-description]"))
        descriptionElement.textContent = mediaObject.description;
    }
  }
}