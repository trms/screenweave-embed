"use strict";
import channelTemplate from './templates/channel.html';
import collectionTemplate from './templates/collection.html';
import mediaTemplate from './templates/media.html';
import ChannelModel from "./models/Channel.js";

function setup() {
  const channelElements = document.querySelectorAll("sw-channel");
  for(const channelElement of channelElements) {
    normalizeChannel(channelElement);
    insertData(channelElement);
  }
}

//Provide default content to empty sw-* tags and remove duplicate subcomponents
function normalizeChannel(channelElement) {
  if(channelElement.innerHTML.trim().length == 0)
    channelElement.innerHTML = channelTemplate;
  normalizeFirstRemoveRest(channelElement.querySelectorAll("sw-collection"), collectionTemplate);
  normalizeFirstRemoveRest(channelElement.querySelectorAll("sw-collection sw-media"), mediaTemplate);
}

function normalizeFirstRemoveRest(elements, template) {
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

function insertData(channelElement) {
  const channelId = channelElement.getAttribute("id");
  const channelData = ChannelModel.getMocks()[channelId];

  //fill in channel level data
  const bannerElements = channelElement.querySelectorAll("[sw-channel-banner]");
  for(const bannerElement of bannerElements) bannerElement.setAttribute("src", channelData.bannerUrl);

  //iterate collections
  const oldCollectionElement = channelElement.querySelector("sw-collection");
  const newCollectionsContainer = document.createElement("span");
  newCollectionsContainer.setAttribute("sw-collections-container", "1");
  if(!oldCollectionElement) {
    console.log(`Channel ${channelId} contained no collection tag!`);
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
        console.log(`Collection elements in channel ${channelId} contain no media tag!`);
      }else{
        for(const mediaObject of collectionObject.media) {
          const mediaElementClone = oldMediaElement.cloneNode(true);
          //fill in media level data
          for(const mediaLinkElement of mediaElementClone.querySelectorAll("[sw-media-link]"))
            mediaLinkElement.setAttribute("href", mediaObject.url);
          for(const mediaLinkElement of mediaElementClone.querySelectorAll("[sw-media-thumbnail]"))
            mediaLinkElement.setAttribute("src", mediaObject.thumbnailUrl);
          for(const mediaLinkElement of mediaElementClone.querySelectorAll("[sw-media-name]"))
            mediaLinkElement.textContent = mediaObject.name;
          
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

window.addEventListener('load', setup);
