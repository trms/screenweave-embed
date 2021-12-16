"use strict";
import "core-js";
import "regenerator-runtime/runtime";

import channelTemplate from './templates/channel.html';
import collectionTemplate from './templates/collection.html';
import mediaTemplate from './templates/media.html';
import Appdata from './appdata.js';

class ScreenweaveEmbed {

  static async setup() {
    const channelElements = document.querySelectorAll("sw-channel");
    const data = await Appdata.loadData(channelElements);
    if(!data) return null;
    for(const channelElement of channelElements) {
      ScreenweaveEmbed.normalizeChannel(channelElement);
      await ScreenweaveEmbed.insertData(channelElement, data.channelsById[data.code2id[channelElement.getAttribute("code")]]);
    }
  }

  //Provide default content to empty sw-* tags and remove duplicate subcomponents
  static normalizeChannel(channelElement) {
    if(channelElement.innerHTML.trim().length == 0)
      channelElement.innerHTML = channelTemplate;
      ScreenweaveEmbed.normalizeFirstRemoveRest(channelElement.querySelectorAll("sw-collection"), collectionTemplate);
      ScreenweaveEmbed.normalizeFirstRemoveRest(channelElement.querySelectorAll("sw-collection sw-media"), mediaTemplate);
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
              mediaLinkElement.setAttribute("href", mediaObject.url);
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
  }
}

window.addEventListener('load', ScreenweaveEmbed.setup);
