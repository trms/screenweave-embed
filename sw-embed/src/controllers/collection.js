import videojs from "video.js";
import IncludeMedia from "./media.js";

export default class EmbedCollection {
  static async insertData(collectionElement, channelData) {
    const collectionId = collectionElement.getAttribute("sw-collection-id");

    //find matching collection object in the channel data
    let collectionObject = null;
    for(const collectionObj of channelData.collections) {
      if(collectionObj.id == collectionId) {
        collectionObject = collectionObj;
        break;
      }
    }

    if(!collectionObject) {
      console.log(`Standalone Collection with id ${collectionId} not found in channel!`);
      return;
    }

    //fill in collection level data
    for(const collectionNameElement of collectionElement.querySelectorAll("[sw-collection-name]"))
      collectionNameElement.textContent = collectionObject.name;

    //iterate media
    const oldMediaElement = collectionElement.querySelector("sw-media");
    const newMediaContainer = document.createElement("span");
    if(!oldMediaElement) {
      console.log(`Standalone Collection ${collectionId} contains no media tag!`);
    }else{
      for(const mediaObject of collectionObject.media) {
        const mediaElementClone = oldMediaElement.cloneNode(true);

        //fill in media level data
        IncludeMedia.insertData(mediaElementClone, mediaObject, () => {EmbedCollection.showVideoDetails(collectionElement, mediaObject)});

        //add new media to container
        newMediaContainer.appendChild(mediaElementClone);
      }
      //replace original media tag with container of data-filled media
      oldMediaElement.parentNode.replaceChild(newMediaContainer, oldMediaElement);
    }

    //universal parts of Video Details
    const videoDetailsElement = collectionElement.querySelector("sw-video-details");
    if(!videoDetailsElement) {
      console.log(`Standalone Collection ${collectionId} contained no video details tag!`);
    }else{
      for(const backElement of videoDetailsElement.querySelectorAll("[sw-video-details-back]"))
        backElement.onclick = () => {EmbedCollection.showCollection(collectionElement)};
    }
  }

  static hideSubcomponents(collectionElement) {
    for(const collection of collectionElement.querySelectorAll("sw-collection > div"))
      collection.style.display = "none";
    for(const details of collectionElement.querySelectorAll("sw-video-details")) {
      for(const videoElement of details.querySelectorAll("video")) {
        videojs(videoElement).dispose();
      }
      details.style.display = "none";
    }
  }

  static showCollection(collectionElement) {
    EmbedCollection.hideSubcomponents(collectionElement);
    for(const collection of collectionElement.querySelectorAll("sw-collection > div"))
      collection.style.display = null;
  }

  static showVideoDetails(collectionElement, mediaObject) {
    EmbedCollection.hideSubcomponents(collectionElement);
    for(const details of collectionElement.querySelectorAll("sw-video-details")) {
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