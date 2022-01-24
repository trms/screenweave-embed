"use strict";
import "core-js";
import "regenerator-runtime/runtime";

/* Since we exclude video.js from the rollup, if we import it here, the compiled code will expect an embedded video.js that isn't there and give runtime errors, even if video.js is loaded some other way.
  Currently we just deal with the IDE warnings that it's missing and expect the calling code to separately include video.js.
  Only import it here if we really decide we want to bundle video.js (in which case also remove it from the rollup ignore list)
*/
//import videojs from "video.js";

import Appdata from './appdata.js';

import channelTemplate                from './templates/channel.html';
import collectionTemplate             from './templates/collection.html';
import standaloneCollectionTemplate   from './templates/collection-standalone.html';
import mediaTemplate                  from './templates/media.html';
import videoDetailsTemplate           from './templates/video-details.html';
import standaloneVideoDetailsTemplate from './templates/video-details-standalone.html';
import errorTemplate                  from './templates/error.html';
import loadingTemplate                from './templates/loading.html';

/* Importing CSS this way bundles it into our dist CSS. Better to not do this with library styles because
  then we'll still need to tell users to include them separately only when they aren't using our default styles.
  Better to exclude it and have the users just include them separately all the time.
*/
//import "video.js/dist/video-js.min.css";

import "./styles/sw-embed.css";

class ScreenweaveEmbed {
  static rootComponentTemplates = {
    "sw-channel":       channelTemplate,
    "sw-collection":    standaloneCollectionTemplate,
    "sw-video-details": standaloneVideoDetailsTemplate,
  };
  static subcomponentTemplates = [
    {tag: "sw-collection",    template: collectionTemplate},
    {tag: "sw-media",         template: mediaTemplate},
    {tag: "sw-video-details", template: videoDetailsTemplate},
    {tag: "sw-error",         template: errorTemplate},
    {tag: "sw-loading",       template: loadingTemplate},
  ];

  static async setup() {
    const rootElements = document.querySelectorAll(
      "sw-channel, " +
      "sw-collection:not(sw-channel sw-collection), " +
      "sw-video-details:not(sw-channel sw-video-details, sw-collection sw-video-details)"
    );

    //gather invite codes and show loading states
    let inviteCodes = [];
    for(const rootElement of rootElements) {
      ScreenweaveEmbed.normalizeRoot(rootElement);
      const inviteCode = rootElement.getAttribute("sw-invite-code");
      if(inviteCode)
      {
        inviteCodes.push(inviteCode);
        ScreenweaveEmbed.showLoading(rootElement);
      }else{
        console.log('[Screenweave Embed] Root embed component missing channel invite code in attribute "sw-invite-code"');
        ScreenweaveEmbed.showError(rootElement, "Setup error");
      }
    }

    //load and show data
    const data = await Appdata.loadData(inviteCodes);
    for(const rootElement of rootElements) {
      const invite = rootElement.getAttribute("sw-invite-code");
      if(!data) {
        ScreenweaveEmbed.showError(rootElement, "Failed to load data");
        continue;
      }
      if(invite && ScreenweaveEmbed.insertData(rootElement, data.channelsById[data.code2id[invite]]))
        ScreenweaveEmbed.showContent(rootElement);
    }
  }

  //Provide default content to empty sw-* tags and remove duplicate subcomponents
  static normalizeRoot(rootElement) {
    const rootTagName = rootElement.tagName.toLowerCase();
    if(rootElement.children.length < 1) rootElement.innerHTML = ScreenweaveEmbed.rootComponentTemplates[rootTagName];
    for(const templateObj of ScreenweaveEmbed.subcomponentTemplates)
      ScreenweaveEmbed.normalizeFirstRemoveRest(rootElement.querySelectorAll(templateObj.tag), templateObj.template);
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

  static hideSubcomponents(rootElement, preserveVideoForStandalone = false) {
    const rootTagName = rootElement.tagName.toLowerCase();
    const videoSelectorNormal = "sw-video-details video";
    const videoSelectorExcludingStandalone = "sw-channel sw-video-details video, sw-collection sw-video-details video";
    const videoSelector = preserveVideoForStandalone ? videoSelectorExcludingStandalone : videoSelectorNormal;
    for(const subcomponentElement of rootElement.querySelectorAll(`${rootTagName} > div, ${rootTagName} > sw-video-details, ${rootTagName} > sw-loading, ${rootTagName} > sw-error`)) {
      for(const videoElement of subcomponentElement.querySelectorAll(videoSelector))
        videojs(videoElement).dispose();
      subcomponentElement.style.display = "none";
    }
  }

  static showLoading(rootElement) {
    ScreenweaveEmbed.hideSubcomponents(rootElement);
    for(const loadingElement of rootElement.querySelectorAll("sw-loading"))
      loadingElement.style.display = "block";
  }

  static showError(rootElement, message) {
    ScreenweaveEmbed.hideSubcomponents(rootElement);
    for(const errorElement of rootElement.querySelectorAll("sw-error")) {
      for(const msgElement of errorElement.querySelectorAll("[sw-error-message]"))
        msgElement.textContent = message;
      errorElement.style.display = "block";
    }
  }

  static showVideoDetails(rootElement, mediaObject) {
    ScreenweaveEmbed.hideSubcomponents(rootElement);
    for(const detailsElement of rootElement.querySelectorAll("sw-video-details")) {
      ScreenweaveEmbed.swapVideo(detailsElement, mediaObject);
      detailsElement.style.display = "block";
    }
  }

  static showContent(rootElement) {
    const rootTagName = rootElement.tagName.toLowerCase();
    ScreenweaveEmbed.hideSubcomponents(rootElement, true);
    for(const contentElement of rootElement.querySelectorAll(rootTagName + " > div"))
      contentElement.style.display = "block";
  }

  static swapVideo(videoDetailsElement, mediaObject) {
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
  }

  static insertData(rootElement, channelData) {
    let identifyingString = "";
    const rootTagName = rootElement.tagName.toLowerCase();
    let success = true;
    if(rootTagName == "sw-channel") {
      identifyingString = `Channel ${channelData.id}: ${channelData.name}`;
      success = ScreenweaveEmbed.insertDataChannel(rootElement, channelData);
    }else if(rootTagName == "sw-collection") {
      identifyingString = `Standalone Collection`
      success = ScreenweaveEmbed.insertDataCollection(rootElement, channelData);
    }else if(rootTagName == "sw-video-details") {
      identifyingString = "Standalone VideoDetails";
      success = ScreenweaveEmbed.insertDataDetails(rootElement, channelData);
    }

    if(rootTagName == "sw-channel" || rootTagName == "sw-collection") {
      //universal parts of Video Details
      const videoDetailsElement = rootElement.querySelector("sw-video-details");
      if(!videoDetailsElement) {
        const mediaElementsWithHref =  rootElement.querySelectorAll("sw-media[sw-href]");
        if(mediaElementsWithHref.length < 1) {
          console.log(`[Screenweave Embed] ${identifyingString} contained no video details tag! Either give it one, or set up HREF navigation so playback can work.`);
          ScreenweaveEmbed.showError(rootElement, "Markup error");
          success = false;
        }
      }else{
        for(const backElement of videoDetailsElement.querySelectorAll("[sw-video-details-back]"))
          backElement.onclick = () => {ScreenweaveEmbed.showContent(rootElement)};
      }
    }
    return success;
  }

  static insertDataChannel(channelElement, channelData) {
    let success = true;
    //fill in channel level data
    const bannerElements = channelElement.querySelectorAll("[sw-channel-banner]");
    for(const bannerElement of bannerElements) bannerElement.setAttribute("src", channelData.bannerUrl);

    //iterate collections
    const oldCollectionElement = channelElement.querySelector("sw-collection");
    const newCollectionsContainer = document.createElement("span");
    if(!oldCollectionElement) {
      console.log(`Channel ${channelData.id} contained no collection tag!`);
      ScreenweaveEmbed.showError(channelElement, "Markup error");
      success = false;
    }else{
      for(const collectionObject of channelData.collections) {
        const collectionElementClone = oldCollectionElement.cloneNode(true);
        success = ScreenweaveEmbed.fillCollection(collectionElementClone, collectionObject, channelElement, `Collection elements inside channel ${channelData.id}: ${channelData.name}`);
        
        //add new collection to container
        newCollectionsContainer.appendChild(collectionElementClone);
      }
      //replace original collection tag with container of data-filled collections
      oldCollectionElement.parentNode.replaceChild(newCollectionsContainer, oldCollectionElement);
    }
    return success;
  }

  static insertDataCollection(collectionElement, channelData) {
    let success = true;
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
      console.log(`Standalone Collection tag requested collection with id ${collectionId} which was not found in the channel data!`);
      ScreenweaveEmbed.showError(collectionElement, "Video collection not found");
      success = false;
    }else{
      success = ScreenweaveEmbed.fillCollection(collectionElement, collectionObject, collectionElement, `Standalone collection element ${collectionObject.id}: ${collectionObject.name}`);
    }
    return success;
  }

  static insertDataDetails(videoDetailsElement, channelData) {
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
      console.log(`Standalone VideoDetails requested media with id ${mediaId} which was not found in the channel data!`);
      ScreenweaveEmbed.showError(videoDetailsElement, "Video not found");
      return false;
    }

    //fill in video data
    ScreenweaveEmbed.swapVideo(videoDetailsElement, mediaObject);

    //fill in non video data
    for(const backElement of videoDetailsElement.querySelectorAll("[sw-video-details-back]")) {
      if(literal) {
        backElement.style.display = "none";
      }else{
        backElement.onclick = () => {history.back()};
      }
    }
    return true;
  }

  static fillMedia(mediaElement, mediaObject, videoDetailsCallback) {
    const href = mediaElement.getAttribute("sw-href");
    for(const mediaLinkElement of mediaElement.querySelectorAll("[sw-media-link]")) {
      if(href) {
        mediaLinkElement.setAttribute("href", href.replaceAll("{id}", mediaObject.showId)); 
      }else{
        mediaLinkElement.onclick = videoDetailsCallback;
      }
    }
    for(const mediaThumbnailElement of mediaElement.querySelectorAll("[sw-media-thumbnail]"))
      mediaThumbnailElement.setAttribute("src", mediaObject.thumbnailUrl);
    for(const mediaNameElement of mediaElement.querySelectorAll("[sw-media-name]"))
      mediaNameElement.textContent = mediaObject.title;
  }

  static fillCollection(collectionElement, collectionObject, rootElement, identifyingString) {
    let success = true;
    for(const collectionNameElement of collectionElement.querySelectorAll("[sw-collection-name]"))
      collectionNameElement.textContent = collectionObject.name;

    //iterate media
    const oldMediaElement = collectionElement.querySelector("sw-media");
    const newMediaContainer = document.createElement("span");
    if(!oldMediaElement) {
      console.log(`${identifyingString} contains no media tag!`);
      ScreenweaveEmbed.showError(rootElement, "Markup error");
      success = false;
    }else{
      for(const mediaObject of collectionObject.media) {
        const mediaElementClone = oldMediaElement.cloneNode(true);
        
        //fill in media level data
        ScreenweaveEmbed.fillMedia(mediaElementClone, mediaObject, () => {ScreenweaveEmbed.showVideoDetails(rootElement, mediaObject)});

        //add new media to container
        newMediaContainer.appendChild(mediaElementClone);
      }
      //replace original media tag with container of data-filled media
      oldMediaElement.parentNode.replaceChild(newMediaContainer, oldMediaElement);
    }
    return success;
  }
}

window.addEventListener('load', ScreenweaveEmbed.setup);
