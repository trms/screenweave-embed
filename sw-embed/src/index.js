"use strict";
import "core-js";
import "regenerator-runtime/runtime";
import Appdata from './appdata.js';
import videojs from "video.js";
import "video.js/dist/video-js.min.css";

import channelTemplate from './templates/channel.html';
import collectionTemplate from './templates/collection.html';
import mediaTemplate from './templates/media.html';
import videoDetailsTemplate from './templates/video-details.html';
import playerTemplate from './templates/player.html';

import "./styles/sw-embed.css";

class ScreenweaveEmbed {
  static async setup() {
    const channelElements = document.querySelectorAll("sw-channel");
    for(const channelElement of channelElements) ScreenweaveEmbed.hideChannelSubcomponents(channelElement);
    const data = await Appdata.loadData(channelElements);
    if(!data) return null;
    for(const channelElement of channelElements) {
      ScreenweaveEmbed.normalizeChannel(channelElement);
      await ScreenweaveEmbed.insertData(channelElement, data.channelsById[data.code2id[channelElement.getAttribute("code")]]);
      ScreenweaveEmbed.showCollections(channelElement);
    }
  }

  //Provide default content to empty sw-* tags and remove duplicate subcomponents
  static normalizeChannel(channelElement) {
    if(channelElement.children.length < 1)
      channelElement.innerHTML = channelTemplate;
      ScreenweaveEmbed.normalizeFirstRemoveRest(channelElement.querySelectorAll("sw-collection"), collectionTemplate);
      ScreenweaveEmbed.normalizeFirstRemoveRest(channelElement.querySelectorAll("sw-collection sw-media"), mediaTemplate);
      ScreenweaveEmbed.normalizeFirstRemoveRest(channelElement.querySelectorAll("sw-video-details"), videoDetailsTemplate);
      ScreenweaveEmbed.normalizeFirstRemoveRest(channelElement.querySelectorAll("sw-player"), playerTemplate);
  }

  static normalizeFirstRemoveRest(elements, template) {
    let first = true;
    for(const element of elements) {
      if(first) {
        first = false;
        if(element.innerHTML.trim().length == 0)
          element.innerHTML = template;
        continue;
      }
      element.remove();
    }
  }

  static async insertData(channelElement, channelData) {
    //fill in channel level data
    const bannerElements = channelElement.querySelectorAll("[sw-channel-banner]");
    for(const bannerElement of bannerElements) bannerElement.setAttribute("src", channelData.bannerUrl);

    //iterate collections
    const oldCollectionElement = channelElement.querySelector("sw-collection");
    const newCollectionsContainer = document.createElement("span");
    newCollectionsContainer.setAttribute("sw-collections-container", "1");
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
        newCollectionsContainer.setAttribute("sw-media-container", "1");
        if(!oldMediaElement) {
          console.log(`Collection elements in channel ${channelData.id} contain no media tag!`);
        }else{
          for(const mediaObject of collectionObject.media) {
            const mediaElementClone = oldMediaElement.cloneNode(true);
            //fill in media level data
            for(const mediaLinkElement of mediaElementClone.querySelectorAll("[sw-media-link]"))
              mediaLinkElement.onclick = () => {ScreenweaveEmbed.showVideoDetails(channelElement, mediaObject)};
              //mediaLinkElement.setAttribute("href", mediaObject.url);
            for(const mediaLinkElement of mediaElementClone.querySelectorAll("[sw-media-thumbnail]"))
              mediaLinkElement.setAttribute("src", mediaObject.thumbnailUrl);
            for(const mediaLinkElement of mediaElementClone.querySelectorAll("[sw-media-name]"))
              mediaLinkElement.textContent = mediaObject.title;
            
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
        backElement.onclick = () => {ScreenweaveEmbed.showCollections(channelElement)};
    }

    //universal parts of Player
    const playerElement = channelElement.querySelector("sw-player");
    if(!playerElement) {
      console.log(`Channel ${channelData.id} contained no player tag!`);
    }else{
      for(const backElement of playerElement.querySelectorAll("[sw-player-back]"))
        backElement.onclick = () => {ScreenweaveEmbed.showCollections(channelElement)};
    }
  }

  static hideChannelSubcomponents(channelElement) {
    for(const collection of channelElement.querySelectorAll("sw-collection"))
      collection.style.display = "none";
    for(const details of channelElement.querySelectorAll("sw-video-details"))
      details.style.display = "none";
    for(const player of channelElement.querySelectorAll("sw-player")) {
      for(const videoElement of player.querySelectorAll("video")) {
        videojs(videoElement).dispose();
      }
      player.style.display = "none";
    }
  }

  static showCollections(channelElement) {
    ScreenweaveEmbed.hideChannelSubcomponents(channelElement);
    for(const collection of channelElement.querySelectorAll("sw-collection"))
      collection.style.display = null;
  }

  static showVideoDetails(channelElement, mediaObject) {
    ScreenweaveEmbed.hideChannelSubcomponents(channelElement);
    for(const details of channelElement.querySelectorAll("sw-video-details")) {
      details.style.display = null;
      for(const playButtonElement of details.querySelectorAll("[sw-video-details-play-button]"))
        playButtonElement.onclick = () => {ScreenweaveEmbed.showPlayer(channelElement, mediaObject)};
      for(const thumbnailElement of details.querySelectorAll("[sw-video-details-thumbnail]"))
        thumbnailElement.setAttribute("src", mediaObject.thumbnailUrl);
      for(const titleElement of details.querySelectorAll("[sw-video-details-title]"))
        titleElement.textContent = mediaObject.title;
      for(const descriptionElement of details.querySelectorAll("[sw-video-details-description]"))
        descriptionElement.textContent = mediaObject.description;
    }
  }

  static showPlayer(channelElement, mediaObject) {
    ScreenweaveEmbed.hideChannelSubcomponents(channelElement);
    for(const player of channelElement.querySelectorAll("sw-player")) {
      player.style.display = null;
      for(const videoElementWrapper of player.querySelectorAll("[sw-player-video-tag-wrapper]")) {
        videoElementWrapper.innerHTML = "<video class='video-js'></video>";
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
    }
  }
}

window.addEventListener('load', ScreenweaveEmbed.setup);
