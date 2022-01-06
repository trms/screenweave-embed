"use strict";
import "core-js";
import "regenerator-runtime/runtime";
import "video.js/dist/video-js.min.css";

import Appdata from './appdata.js';
import EmbedChannel from './controllers/channel.js';
import EmbedCollection from './controllers/collection.js';
import EmbedDetails from './controllers/details.js';

import channelTemplate from './templates/channel.html';
import collectionTemplate from './templates/collection.html';
import standaloneCollectionTemplate from './templates/collection-standalone.html';
import mediaTemplate from './templates/media.html';
import videoDetailsTemplate from './templates/video-details.html';

import "./styles/sw-embed.css";

class ScreenweaveEmbed {
  static async setup() {
    //identify root elements
    const channelElements = document.querySelectorAll("sw-channel");
    const standaloneCollectionElements = document.querySelectorAll("sw-collection:not(sw-channel sw-collection)");
    const standaloneVideoDetailsElements = document.querySelectorAll("sw-video-details:not(sw-channel sw-video-details)");

    //gather invite codes and initiate loading states
    let inviteCodes = [];
    for(const channelElement of channelElements) {
      EmbedChannel.hideChannelSubcomponents(channelElement);
      const inviteCode = channelElement.getAttribute("sw-invite-code");
      if(inviteCode) inviteCodes.push(inviteCode);
    }
    for(const collectionElement of standaloneCollectionElements) {
      EmbedCollection.hideSubcomponents(collectionElement);
      const inviteCode = collectionElement.getAttribute("sw-invite-code");
      if(inviteCode) inviteCodes.push(inviteCode);
    }
    for(const detailsElement of standaloneVideoDetailsElements) {
      const inviteCode = detailsElement.getAttribute("sw-invite-code");
      if(inviteCode) inviteCodes.push(inviteCode);
    }

    //load and show data
    const data = await Appdata.loadData(inviteCodes);
    if(!data) return null;
    for(const channelElement of channelElements) {
      const channelObject = 
      ScreenweaveEmbed.normalizeChannel(channelElement);
      await EmbedChannel.insertData(channelElement, data.channelsById[data.code2id[channelElement.getAttribute("sw-invite-code")]]);
      EmbedChannel.showCollections(channelElement);
      channelElement.style.visibility = "visible";
    }
    for(const collectionElement of standaloneCollectionElements) {
      ScreenweaveEmbed.normalizeStandaloneCollection(collectionElement);
      await EmbedCollection.insertData(collectionElement, data.channelsById[data.code2id[collectionElement.getAttribute("sw-invite-code")]]);
      EmbedCollection.showCollection(collectionElement);
      collectionElement.style.visibility = "visible";
    }
    for(const detailsElement of standaloneVideoDetailsElements) {
      ScreenweaveEmbed.normalizeStandaloneVideoDetails(detailsElement);
      EmbedDetails.insertData(detailsElement, data.channelsById[data.code2id[detailsElement.getAttribute("sw-invite-code")]])
    }
  }

  //Provide default content to empty sw-* tags and remove duplicate subcomponents
  static normalizeChannel(channelElement) {
    if(channelElement.children.length < 1)
      channelElement.innerHTML = channelTemplate;
    ScreenweaveEmbed.normalizeFirstRemoveRest(channelElement.querySelectorAll("sw-collection"), collectionTemplate);
    ScreenweaveEmbed.normalizeFirstRemoveRest(channelElement.querySelectorAll("sw-collection sw-media"), mediaTemplate);
    ScreenweaveEmbed.normalizeFirstRemoveRest(channelElement.querySelectorAll("sw-video-details"), videoDetailsTemplate);
  }

  //Provide default content to empty sw-* tags and remove duplicate subcomponents
  static normalizeStandaloneCollection(collectionElement) {
    if(collectionElement.children.length < 1)
      collectionElement.innerHTML = standaloneCollectionTemplate;
    ScreenweaveEmbed.normalizeFirstRemoveRest(collectionElement.querySelectorAll("sw-media"), mediaTemplate);
    ScreenweaveEmbed.normalizeFirstRemoveRest(collectionElement.querySelectorAll("sw-video-details"), videoDetailsTemplate);
  }


  //Provide default content to empty sw-* tags
  static normalizeStandaloneVideoDetails(detailsElement) {
    if(detailsElement.children.length < 1)
      detailsElement.innerHTML = videoDetailsTemplate;
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


}

window.addEventListener('load', ScreenweaveEmbed.setup);
